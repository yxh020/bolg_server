let mongoose = require('mongoose')
 //1引入模式对象
let Schema = mongoose.Schema



 //2创建注册的约束对象
let textRule = new Schema({
    username:{//用户名
         type:String,
         required:true, 
    },
    star:{//点赞
         type:Number,
         default:0
    },
    date:{//时间
         type:String,
    },
    enable_flag:{
         type:String,
         default:'Y'
    },
    comments:{//评论
        type:Array,
        default:[]
    },
    title:{//标题
        type:String,
        require:true
    },
    sort:{//分类
        type:String,
        require:true
    },
    text:{
        type:String,
        require:true
    }
})
 //3创建模型对象
module.exports =  mongoose.model('text',textRule)//用于生成某个集合所对应的模型对象

