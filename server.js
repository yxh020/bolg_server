const express = require('express')
const app = express()
app.disable('x-powered-by')
let moment = require('moment');
//引入登录注册模型对象,CRUD
const usersModel = require('./model/usersModel')
//引入文章模型对象
const textModel = require('./model/textModel')
const cookParser = require('cookie-parser');
//引入db模块
const db = require('./db/db')
//const { text } = require('express')
// const jwt = require('jsonwebtoken')
// const {PRIVATE_KEY} = require('../config')
//使用内置中间件用于解析post请求的urlencoded参数
app.use(cookParser());
app.use(express.urlencoded({extended:true}))

app.use((req, res, next) => {
    // 设置响应头
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    // OPTIONS 预检请求，当请求方式不是get和post / 请求头包含非默认参数
    // 预检请求作用：检查当前请求是否允许跨域
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'content-type, authorization, accept');
    res.set('Access-Control-Max-Age', 86400);
    // 快速返回预检请求响应
    if (req.method.toLowerCase() === 'options') {
      // 命中了预检请求
      return res.end();
    }
    next();
});

//若连接服务器成功便启动服务器
db(() => {
    //注册路由
    app.post('/register',(req,res) => {
        // console.log('11111')
        const {username,password} = req.body
        // console.log(username,password)
        usersModel.findOne({username,password},(err,data) => {
            if(!err){
                //console.log(data.enable_flag)
                if(data!==null){
                    //说明被注册过
                    console.log('被注册过了')
                    res.send({status: 1, msg:'此用户名已被注册！'})
                }else{ 
                    //说明没有人注册,添加进数据库
                    usersModel.create(
                        {username,password,date:moment().format('YYYY-MM-DD HH:mm:ss.SSS')},
                        function(err,data){
                            if(!err){
                                //console.log(data)
                                console.log('注册成功')
                                res.send({
                                    status: 0,
                                    data:username
                                })
                            }else{ 
                                console.log(err)
                                res.send({status: 1, msg:'当前网络质量差,请重新尝试！'})
                            }
                    })
                    
                }
            
            }
            else console.log(err);
        })

    })
    //登录路由
    app.post('/login',(req,res) => {
        // console.log('---')
        const {username,password} = req.body
        //console.log(req.body)
        console.log(username,password)
        usersModel.findOne({username,password},(err,data) => {
            if(!err){
                //console.log(data.enable_flag)
                if(data!==null  && data.enable_flag==='Y'){
                    console.log('密码正确，验证通过')
                    //const token = jwt.sign({id:username},PRIVATE_KEY,{ expiresIn: '7 days' })
                    res.send({status:0,data:{username:data.username,id:data._id}})
                }else{ 
                    console.log('密码或账号不正确');
                    res.send({status: 1, msg: '用户名或密码不正确!'})
                }
            }
            else console.log(err);
        })

    })
    //查询分类路由
    app.post('/getsort',(req,res) => {
        console.log('---');
        const {id} = req.body
        //console.log(id);
        usersModel.findOne({_id:id},(err,data) => {
            if(!err){
                // console.log(data);
                const {sort} = data
                res.send({status:0,data:{sort}})
            }else console.log(err)
        }
        )
    })
    //更新分类路由
    app.post('/updatesort',(req,res) => {

        //console.log('1111'); 
        const {id,arr} = req.body
        //console.log(id,arr);
        usersModel.updateOne({_id:id},{sort:arr},(err,data) => {
            if(!err){
                res.send({status:0})
                // usersModel.findOne({_id:id},(err,data) => {
                //     if(!err){
                //         // console.log(data);
                //         const {sort} = data
                //         res.send({status:0,data:{sort}})
                //     }else console.log(err)
                // }
                // )
            }else console.log(err)
        }
        )
    })
    //添加文章路由
    app.post('/addtext',(req,res) => {
        console.log('add');
        const {title,username,sort,text} = req.body
        //console.log(title,username,sort,text);
        textModel.create({
            title:title,
            username:username,
            sort:sort,
            text:text,
            date:moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        },function(err,data){
            if(!err){
                res.send({status: 0})
                console.log(data)
            } 
            else console.log(err);
        })
    })
    //获取文章路由
    app.post('/reqtext',(req,res) => {
        //console.log('QQWZ');
        const{data} = req.body
       // console.log(data); 
        if(data==1){
            //console.log('11111');
            textModel.find({enable_flag:'Y'},(err,data) => {
                if(!err){
                    res.send({status: 0,data})
                }else{}
            }).limit(6).sort({'date': -1})
        }else{
            textModel.find({_id:data},(err,data) => {
                if(!err){
                    //console.log('222222');
                    res.send({status: 0,data})
                }else{}
            }) 
        }
    })
    //更新评论请求
    app.post('/updatecomment',(req,res) => {
        //console.log('更新评论');
        const{_id,username,comment} = req.body
        //console.log(_id,username,comment);
        //console.log(id); 
        textModel.find({_id:_id},(err,data) => {
            if(!err){
                let comments = data[0].comments
                //console.log(comments);
                let arr = {[username]:comment}
                comments.unshift(arr)
                //console.log(comments);
                textModel.updateOne({_id:req.body._id},{comments:comments},(err,data) => {
                    if(!err){
                        //console.log(data);
                        res.send({status: 0})
                    }  
                })
            }
        })
    })
    //获取所有评论
    app.post('/getcomments',(req,res) => {
       // console.log('获取评论');
        const{_id} = req.body
        textModel.findOne({_id},(err,data) => {
            if(!err){
                let comments=data.comments
                res.send({status: 0,comments})
                //console.log(data.comments);
            }else{}
        })
    })
    //请求更多文章
    app.post('/getmoretext',(req,res) => {
        //console.log('获取更多文章');
        if (req.body._id!==undefined){
            const {_id} = req.body
            textModel.find({'_id':{'$lte':_id}},(err,data) => {
                if(!err){
                    if(data.length>0){
                        // console.log(data);
                        let now =data[0].date
                        //console.log('2',now);
                        let obj = {textdate:now}
                        res.cookie('text',JSON.stringify(obj)) 
                            //console.log('1111111111');
                        res.send({status: 0,data})
                    }else{
                        //console.log('22222');
                        res.send({status: 1, msg:'无更多内容！'})
                    }
            }else{
                res.send({status: 1, msg:'无更多内容！'})
            }
        }).skip(1).limit(6).sort({'date': -1})
        }else{
            res.send({status: 0,date})
        }
       
    })
    //cookie请求
    app.post('/getlast',(req,res) => {
        console.log('by_cookie');
        const{text} = req.cookies
        let a = JSON.parse(text)
        console.log('1',a.textdate);
        //console.log('cookie',text); 
        textModel.find({'date':{'$gt':a.textdate},'enable_flag':'Y'},(err,data) => {
            if(!err){
                if(data.length<=0){
                    res.send({status: 1,msg:'没了没了'})
                }else{
                    console.log(data.length);
                    let a = data.length
                    let now =data[--a].date
                    console.log('2',now);
                    let obj = {textdate:now}
                    res.cookie('text',JSON.stringify(obj)) 
                        //console.log('1111111111');
                    res.send({status: 0,data})
                }
                
            }else{}
        }).limit(6).sort({'date': 1})
    })
    //获取个人信息
    app.post('/getuserinfo',(req,res) => {
        let id = req.body.id
        //console.log(id);
        usersModel.findOne({'_id':id},{__v:1,username:1},(err,data) => {
            if(!err){
                if(data!=null){
                    //console.log(data);
                    if(data.__v>0){
                        //为管理员
                        usersModel.find({'enable_flag':'Y'},{username:1,date:1,_id:0},(err,data) => {
                            if(!err&&data!=null){
                                //console.log('用户信息',data);
                                let userdata =data
                                //res.send({status:0,data})
                                textModel.find({'enable_flag':'Y'},{title:1,date:1},(err,data) => {
                                    if(!err&&data!=null){
                                        //console.log('全部文章',data);
                                        //status:2返回2代表是管理员账户
                                        res.send({status:2,data:{textdata:data,userdata}})
                                    }else{}
                                })
                            }
                        })
                    }else{
                        //普通用户
                        console.log('22222');
                        textModel.find({'enable_flag':'Y','username':data.username},{title:1,date:1},(err,data) => {
                            if(!err&&data!=null){
                                console.log(data);
                                res.send({status:0,data:{textdata:data}})
                            }else{}
                        })
                    }
                }else{
                    res.send({status:1,msg:'查询出错'})
                }
                
            }
        })
    })
    //删除文章
    app.post('/deletetext',(req,res) => {
        let date = req.body.date
        console.log(date)
        textModel.updateOne({'date':date},{'enable_flag':'N'},(err,data) => {
            if(!err){
                res.send({status:0})
            }
        })
    })
    //删除用户
    app.post('/deleteuser',(req,res) => {
        let date = req.body.date
        console.log(date)
        usersModel.updateOne({'date':date},{'enable_flag':'N'},(err,data) => {
            if(!err){
                res.send({status:0})
            }
        })
    })
    
    app.post('/find',(req,res) => {
        let date = req.body.date
        //console.log(date)
        textModel.find({'title':{$regex:date},'enable_flag':'Y'},(err,data) => {
            if(!err){
                //console.log(data);
                res.send({status:0,data})
            }else{
                res.send({status:1,msg:'网络差，稍后再试'}) 
            }
        })
    })



    app.listen(4000,function(err){
        if(!err) console.log('服务器启动成功...')
        else console.log(err)
    })
},(err) => {
   console.log(err); 
}
)


