from flask import Flask
from flask import request,jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import json
import hashlib
import os
import jwt

app = Flask(__name__,static_url_path='/static')
CORS(app)
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Harshit_1995'
app.config['MYSQL_DB'] = 'eval'
app.config['MY_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

def md5_hash(string):
    hash = hashlib.md5()
    hash.update(string.encode('utf-8'))
    return str(hash.hexdigest())

def salt():
    salt = os.urandom(16)
    return salt.hex()

def alluser():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """ select * from user"""
    )
    result = cursor.fetchall()
    cursor.close()
    global users
    users = []
    for item in result:
        users.append(item)


@app.route("/register" , methods =["post"])   #registering the user
def register():
    pic = request.files['picture']
    location = "static/"+pic.filename
    pic.save(location)
    username = request.form['username']
    password = request.form['password']
    email = request.form['email']
    print(username,password,location)
    password1 = md5_hash(password)
    for i in range(50):
        salt1 = salt()
    final_password = password1 + salt1
    print(salt1,final_password)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """insert into user(username,email,password,salt,profile) values(%s,%s,%s,%s,%s) ; """,[username,email,final_password,salt1,location]
    )
    mysql.connection.commit()
    cursor.close()
    return "registered"


@app.route("/login", methods = ["post"])                    #Login
def login():    
    alluser()
    email = request.json['email']
    password = request.json['password']
    password1 = md5_hash(password)
    for i in users:
        if i[2] == email:
            if i[3] == password1 + i[4]:
                encode_data = jwt.encode({"id":i[0]}, 'masai', algorithm='HS256')
                token = str(encode_data).split("'")[1]
                return jsonify({"token":token,"id":i[0],"username":i[1],"email":i[2],"picture":i[5]})
                
@app.route("/retain")                   #retaining the session 
def retain():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    cursor = mysql.connection.cursor()
    cursor.execute(
        """select * from user where id = %s ;""",[user_id]
    )
    result = cursor.fetchall()
    send = []
    for i in result:
        return jsonify({"id":i[0],"username":i[1],"email":i[2],"picture":i[5]})


@app.route("/post", methods = ["post"])                         #post from a user
def post():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    pic = request.files['picture']
    location = "static/" + pic.filename
    pic.save(location)
    post_body = request.form['postbody']
    post_title = request.form['posttitle']
    print(user_id,location,post_body,post_title)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """insert into post(post_body,post_pic,user_id,post_title) values(%s,%s,%s,%s) ;""",[post_body,location,user_id,post_title]
    )
    mysql.connection.commit()
    cursor.close()
    return "posted"

@app.route("/alluser")
def giveuser():
    alluser()
    return jsonify({"users":users})

@app.route("/allpost")                  #all posts
def all():
    cursor = mysql.connection.cursor()
    cursor.execute(
        """select * from user join post on user.id = post.user_id;"""
    )
    result = cursor.fetchall()
    return jsonify({"all":result})

@app.route("/userpost", methods = ["post"])                 #to get only user post
def single():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    print(user_id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """select * from user join post on user.id = post.user_id where user.id = %s;""",[user_id]
    )
    result = cursor.fetchall()
    return jsonify({"user_post":result})

@app.route("/profile", methods = ["post"])
def profileupdate():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    pic = request.files['picture']
    location = "static/" + pic.filename
    pic.save(location)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """update user set profile = %s where id = %s """,[location,user_id]
    )
    mysql.connection.commit()
    return "done "




@app.route("/comment" , methods = ["post"])                 #for commenting
def comment():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    comment = request.json['comment']
    post_id = request.json['post_id']
    print(comment,post_id,user_id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """insert into comment(comment,post_id,user_id) values(%s,%s,%s) ;""",[comment,post_id,user_id]
    )
    mysql.connection.commit()
    cursor.close()
    return "commented"

@app.route("/showcomments",methods =  ["post"])    #Comments for the post
def posts_comment():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    post_id = request.json['post_id']
    cursor = mysql.connection.cursor()
    cursor.execute(
        """select comment.comment,user.username from user join comment on comment.user_id = user.id where user.id = %s and comment.post_id =%s ; """,[user_id,post_id]
    )
    result = cursor.fetchall()
    print(result)
    return jsonify({"comments":result})

@app.route("/follow",methods = ["post"])
def follow():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    friend_id = request.json['friend_id']
    print(user_id,friend_id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """insert into friends(user_id,friend_id) values(%s,%s) ; """,[ user_id , friend_id ] 
    )
    mysql.connection.commit()
    cursor.execute(
        """select * from user where id=%s;""",[friend_id]    # to show the name of just followed user 
    )
    result = cursor.fetchall()
    cursor.close()
    return jsonify({"follow":result})

@app.route("/friends",methods = ["post"])
def getfriends():
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    print(user_id)
    cursor = mysql.connection.cursor()
    cursor.execute(
        """select * from user join friends on friends.friend_id = user.id where friends.user_id = %s;""",[user_id]

    )
    result = cursor.fetchall()
    print(result)
    return jsonify({"followers":result})

@app.route("/friendpost",methods = ["post"])
def friendpost():
    alluser()
    auth_header1 = request.headers.get('Authorization1')
    decoded_data = jwt.decode(auth_header1,'masai',algorithm='HS256')
    user_id = decoded_data["id"]
    cursor = mysql.connection.cursor()
    cursor.execute(
        """select * from post join friends on post.user_id = friends.friend_id where friends.user_id = %s; """,[user_id]
    )
    result = cursor.fetchall()
    send = []
    limit = request.headers.get('limit',default = 1,type =int)
    for i in result:
        for j in users:
            if i[3] == j[0]:
                send.append({"post_id":i[0],"post_title":i[5],"post_body":i[1],"post_pic":i[2],"user_id":i[3],"username":j[1],"userimage":j[5]})

    limit_high = (limit)*4
    limit_low = limit_high - 4
    ans = send[limit_low:limit_high]
    return jsonify({"post":ans})

if __name__ == "__main__":
    app.run(port=5000,debug = True)


  # harshittoken #eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.OJUcq4LSbIbeHpjlYR0kntuHNJfgyrMFDkCcoqjKH-U 
  #anuj token #eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6M30.Vs0h1NONa4BqAlTQPD_II_RpsqeYJ_c8TcI8HKzGrfo