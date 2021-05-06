let mongoose = require('mongoose')
//引入数据库连接模块
let db = require('./db/db')
//引入注册模型
let registerModel = require('./model/usersModel')
//引入文章模型对象
const textModel = require('./model/textModel')
let moment = require('moment');

//判断数据的连接状态，若成功，CRUD
//判断数据的连接状态，若失败，报告错误        
db((err) => {
    if (err) console.log(err)
    else{
        //增
        // registerModel.create({
        //     username:'11',
        //     password:'111111',
        // },function(err,data){
        //     if(!err) console.log(data)
        //     else console.log(err);
        // })

        //查
        textModel.find({},{title:1},function(err,data){
            if(!err) console.log(data)
            else console.log(err)
        })
        // registerModel.findOne({id:"60698ddced6c8735e48c6ac2"},(err,data) => {
        //     if(!err){
        //         console.log(data);
        //         // const {sort} = data
        //         // res.send({status:0,data:{sort}})
        //     }else console.log(err)
        // }
        // )
        // let t1=moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        // // console.log(t1);
        // //更新
        // textModel.updateOne({title:'魔法蛋糕店'},{date:moment().format('YYYY-MM-DD HH:mm:ss.SSS')},function(err,data){
        //      if(!err) console.log(data.date)
        //      else console.log(err)
        // })

        //删除
        // registerModel.deleteMany({age:30},(err,data) => {
        //     err?console.log(data):console.log(err)
        // })
    }
})       

        

