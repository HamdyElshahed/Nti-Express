var express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const {ObjectId} = require('mongoose').Types

const {Article} = require('../models/article_model')
const {validate} = require('../method/validition')

router.get('/' , async (req, res) => {
  const articles = await Article.find()
  res.json({articles})
})

router.get('/publisher/:id' , async (req, res) => {
  const {id} = req.params;
  const articles = await Article.find({"publisher.id": id});
  return res.json({articles});
})

router.get('/:id' , async (req, res) => {
  const {id} = req.params;
  const response = {};
  try {
    const article = await Article.findById(id);
    if (!article) {
      response.msg ='Article not found';
    }else{
      response.article = article;
    }

  }catch(err) {}
  res.json(response);
})

router.post('/insert', async (req , res) =>{
  try{

    const {title , content} = req.body;
    let user;
    user = jwt.verify(req.headers.authorization.split(' ')[1], '123456789')
    const article = Article({
      title, content,
      publisher:{
        id: user.id,
        name: user.name
      }
    })
    await article.save()
    res.json({
      result: 'article inserter successfuly',
      article
    })
  }catch(err){
    res.status(400).json({msg:'invalid token'})
  }
})

router.put('/:id' , async (req , res) =>{
  const {id} = req.params;
  const {title , content}= req.body;
  const response = {};
 
  try{
    let user = jwt.verify(req.headers.authorization.split(' ')[1], '123456789')
    let article = await Article.findById(id);
    if (!article){
      article = Article({
        title , content,
        publisher: {
        id: user.id,
        name: user.name}
      })
      response.msg = 'article not found, new article created'
    }else{
      article.title=title;
      article.content=content;
  
      response.msg = 'article update successfully';
    }

    await article.save()
    response.article = article
  
    res.json(response)
  }catch(err){
    console.log(err)
    res.status(400).json({msg:'invalid token'})
  }
})

router.delete('/:id' , validate , async (req, res)=>{
  const {id} = req.params
  const response = {};

  const article = await Article.findById(id)

  if(new ObjectId(article.publisher.id).equals(new ObjectId(req.user.id))||req.user.role === 'admin'){
    (await article).delete();
  }
  const articles = await Article.find();
  response.articles = articles;
  res.json(response)
})

module.exports = router;
