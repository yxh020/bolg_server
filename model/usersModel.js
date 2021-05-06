let mongoose = require('mongoose')
 //1引入模式对象
let Schema = mongoose.Schema
let moment = require('moment');
 //2创建注册的约束对象
let registerRule = new Schema({
     username:{
         type:String,
         required:true, 
         unique:true
     },
     password:{
         type:String,
         required:true, 
     },
     age:{
         type:Number,
         default:18
     },
     star:{
         type:Number,
         default:0
     },
     date:{
         type:String,
         //default:moment().format('YYYY-MM-DD HH:mm:ss.SSS')
     },
     enable_flag:{
         type:String,
         default:'Y'
     },
     sort:{
         type:Array,
         default:[]
     }
 })
 //3创建模型对象
module.exports =  mongoose.model('user',registerRule)//用于生成某个集合所对应的模型对象

