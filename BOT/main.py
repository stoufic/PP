import statistics
from typing import Optional
from fastapi import FastAPI
from fastapi.params import B 
from pydantic import BaseModel
from random import randrange
import psycopg2
from psycopg2.extras import RealDictCursor
import mod
els
import database
import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Post(BaseModel):
    title: str
    content: str
    published: bool = True

try:
    conn = psycopg2.connect(host='localhost', database= 'fastapi', user= 'postgres', password= 'Coolguy3', 
                            cursor_factory= RealDictCursor)
    cursor = conn.cursor()
    print("Device is Connected.")
except Exception as Error:
    print("No Can Do.")


my_posts = [{"title": "title of post 1", "content": "content of post 1", "id": 1}, {"title": "favorite cars", "content": "I love F1", "id": 2}]

def find_post(id):
    for p in my_posts:
        if p['id'] ==id:
            return p

def find_index_post(id):
    for i, p in enumerate(my_posts):
        if p['id'] == id:   
            return i 

@app.get("/")
def root():
    return{"message": "bruh"}

@app.get("/post")
def get_post():
    cursor.execute("""SELECT * FROM post""")
    posts = cursor.fetchall()
    return{"data": posts}

@app.post("/post")
def create_posts(post: Post):
    cursor.execute("""INSERT INTO post (title, content, published) VALUES (%s, %s, %s) RETURNING * """, (post.title, post.content, post.published))
    new_post = cursor.fetchone()

    conn.commit()

    return {"data": new_post}

@app.get("/posts/{id}")
def get_post(id):
    if (int(id)) <= int(2):
        print(id)
        return {"post_detail": f"This is the first post {id}"}
    else:
        print(id)
        return {"post_detail": f"The {id} is invalid, try agian?"}

@app.delete("/posts/{id}")
def delete_post():
    index = find_index_post(id)

    my_posts.pop(index)
    return{"message": "post was deleted"}

@app.put("/post/{id}")
def update_post(id: int, post: Post):
    index = find_index_post(id)

    post_dict = post.dict()
    post_dict['id'] = id
    my_posts[index] = post_dict
    return {"data": post_dict}

