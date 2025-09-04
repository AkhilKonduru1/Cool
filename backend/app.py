from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
import os
from functools import wraps

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///eventure.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    level = db.Column(db.Integer, default=1)
    points = db.Column(db.Integer, default=0)
    streak = db.Column(db.Integer, default=0)
    adventures_completed = db.Column(db.Integer, default=0)
    badges_earned = db.Column(db.Integer, default=0)
    
    # Relationships
    adventures = db.relationship('Adventure', backref='user', lazy=True)
    memories = db.relationship('Memory', backref='user', lazy=True)
    friend_requests_sent = db.relationship('FriendRequest', foreign_keys='FriendRequest.sender_id', backref='sender', lazy=True)
    friend_requests_received = db.relationship('FriendRequest', foreign_keys='FriendRequest.receiver_id', backref='receiver', lazy=True)
    friendships = db.relationship('Friendship', foreign_keys='Friendship.user_id', backref='user', lazy=True)

class Adventure(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    points_earned = db.Column(db.Integer, default=0)

class Memory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    adventure_id = db.Column(db.Integer, db.ForeignKey('adventure.id'), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class FriendRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(500), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, accepted, declined
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Friendship(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    friend_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Badge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    emoji = db.Column(db.String(10), nullable=False)
    rarity = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(50), nullable=False)

class UserBadge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badge.id'), nullable=False)
    earned_at = db.Column(db.DateTime, default=datetime.utcnow)

# JWT Token decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['user_id']).first()
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    return decorated

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already taken'}), 400
    
    hashed_password = generate_password_hash(data['password'])
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password
    )
    
    db.session.add(user)
    db.session.commit()
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'level': user.level,
            'points': user.points,
            'streak': user.streak,
            'adventures_completed': user.adventures_completed,
            'badges_earned': user.badges_earned
        }
    }), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=30)
    }, app.config['SECRET_KEY'], algorithm='HS256')
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'level': user.level,
            'points': user.points,
            'streak': user.streak,
            'adventures_completed': user.adventures_completed,
            'badges_earned': user.badges_earned
        }
    })

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_profile(current_user):
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email,
        'level': current_user.level,
        'points': current_user.points,
        'streak': current_user.streak,
        'adventures_completed': current_user.adventures_completed,
        'badges_earned': current_user.badges_earned,
        'created_at': current_user.created_at.isoformat()
    })

@app.route('/api/adventures', methods=['POST'])
@token_required
def create_adventure(current_user):
    data = request.get_json()
    
    adventure = Adventure(
        user_id=current_user.id,
        title=data['title'],
        description=data['description'],
        location=data['location'],
        category=data['category'],
        points_earned=data.get('points_earned', 50)
    )
    
    db.session.add(adventure)
    
    # Update user stats
    current_user.adventures_completed += 1
    current_user.points += adventure.points_earned
    current_user.streak += 1
    
    # Check for level up
    if current_user.points >= current_user.level * 1000:
        current_user.level += 1
    
    db.session.commit()
    
    return jsonify({
        'message': 'Adventure saved successfully',
        'adventure': {
            'id': adventure.id,
            'title': adventure.title,
            'description': adventure.description,
            'location': adventure.location,
            'category': adventure.category,
            'points_earned': adventure.points_earned,
            'completed_at': adventure.completed_at.isoformat()
        }
    }), 201

@app.route('/api/adventures', methods=['GET'])
@token_required
def get_adventures(current_user):
    adventures = Adventure.query.filter_by(user_id=current_user.id).order_by(Adventure.completed_at.desc()).all()
    
    return jsonify({
        'adventures': [{
            'id': adventure.id,
            'title': adventure.title,
            'description': adventure.description,
            'location': adventure.location,
            'category': adventure.category,
            'points_earned': adventure.points_earned,
            'completed_at': adventure.completed_at.isoformat()
        } for adventure in adventures]
    })

@app.route('/api/friends/search', methods=['GET'])
@token_required
def search_friends(current_user):
    query = request.args.get('q', '')
    if not query:
        return jsonify({'users': []})
    
    users = User.query.filter(
        User.username.contains(query),
        User.id != current_user.id
    ).limit(10).all()
    
    return jsonify({
        'users': [{
            'id': user.id,
            'username': user.username,
            'level': user.level,
            'adventures_completed': user.adventures_completed
        } for user in users]
    })

@app.route('/api/friends/request', methods=['POST'])
@token_required
def send_friend_request(current_user):
    data = request.get_json()
    friend_id = data.get('friend_id')
    message = data.get('message', '')
    
    if not friend_id:
        return jsonify({'message': 'Friend ID is required'}), 400
    
    if friend_id == current_user.id:
        return jsonify({'message': 'Cannot send friend request to yourself'}), 400
    
    # Check if request already exists
    existing_request = FriendRequest.query.filter_by(
        sender_id=current_user.id,
        receiver_id=friend_id,
        status='pending'
    ).first()
    
    if existing_request:
        return jsonify({'message': 'Friend request already sent'}), 400
    
    friend_request = FriendRequest(
        sender_id=current_user.id,
        receiver_id=friend_id,
        message=message
    )
    
    db.session.add(friend_request)
    db.session.commit()
    
    return jsonify({'message': 'Friend request sent successfully'}), 201

@app.route('/api/friends/requests', methods=['GET'])
@token_required
def get_friend_requests(current_user):
    requests = FriendRequest.query.filter_by(
        receiver_id=current_user.id,
        status='pending'
    ).all()
    
    return jsonify({
        'requests': [{
            'id': req.id,
            'sender': {
                'id': req.sender.id,
                'username': req.sender.username,
                'level': req.sender.level,
                'adventures_completed': req.sender.adventures_completed
            },
            'message': req.message,
            'created_at': req.created_at.isoformat()
        } for req in requests]
    })

@app.route('/api/friends/requests/<int:request_id>/respond', methods=['POST'])
@token_required
def respond_to_friend_request(current_user, request_id):
    data = request.get_json()
    action = data.get('action')  # 'accept' or 'decline'
    
    if action not in ['accept', 'decline']:
        return jsonify({'message': 'Invalid action'}), 400
    
    friend_request = FriendRequest.query.filter_by(
        id=request_id,
        receiver_id=current_user.id,
        status='pending'
    ).first()
    
    if not friend_request:
        return jsonify({'message': 'Friend request not found'}), 404
    
    friend_request.status = action
    
    if action == 'accept':
        # Create friendship
        friendship1 = Friendship(user_id=current_user.id, friend_id=friend_request.sender_id)
        friendship2 = Friendship(user_id=friend_request.sender_id, friend_id=current_user.id)
        db.session.add(friendship1)
        db.session.add(friendship2)
    
    db.session.commit()
    
    return jsonify({'message': f'Friend request {action}ed successfully'})

@app.route('/api/friends', methods=['GET'])
@token_required
def get_friends(current_user):
    friendships = Friendship.query.filter_by(user_id=current_user.id).all()
    
    friends = []
    for friendship in friendships:
        friend = User.query.get(friendship.friend_id)
        friends.append({
            'id': friend.id,
            'username': friend.username,
            'level': friend.level,
            'adventures_completed': friend.adventures_completed,
            'points': friend.points
        })
    
    return jsonify({'friends': friends})

@app.route('/api/memories', methods=['POST'])
@token_required
def create_memory(current_user):
    data = request.get_json()
    
    memory = Memory(
        user_id=current_user.id,
        adventure_id=data.get('adventure_id'),
        title=data['title'],
        description=data['description']
    )
    
    db.session.add(memory)
    db.session.commit()
    
    return jsonify({
        'message': 'Memory saved successfully',
        'memory': {
            'id': memory.id,
            'title': memory.title,
            'description': memory.description,
            'created_at': memory.created_at.isoformat()
        }
    }), 201

@app.route('/api/memories', methods=['GET'])
@token_required
def get_memories(current_user):
    memories = Memory.query.filter_by(user_id=current_user.id).order_by(Memory.created_at.desc()).all()
    
    return jsonify({
        'memories': [{
            'id': memory.id,
            'title': memory.title,
            'description': memory.description,
            'created_at': memory.created_at.isoformat()
        } for memory in memories]
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create some default badges
        if not Badge.query.first():
            default_badges = [
                Badge(name='First Steps', description='Complete your first adventure', emoji='👶', rarity='common', category='milestone'),
                Badge(name='Explorer', description='Complete 10 adventures', emoji='🗺️', rarity='common', category='milestone'),
                Badge(name='Social Star', description='Share 25 adventures with friends', emoji='⭐', rarity='rare', category='social'),
                Badge(name='Night Owl', description='Complete 5 adventures after 10 PM', emoji='🦉', rarity='epic', category='special'),
                Badge(name='Legendary Adventurer', description='Complete 100 adventures', emoji='👑', rarity='legendary', category='milestone'),
            ]
            for badge in default_badges:
                db.session.add(badge)
            db.session.commit()
    
    app.run(debug=True, host='0.0.0.0', port=5001)
