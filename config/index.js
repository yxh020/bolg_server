
/* 
配置token检查白名单
不需要进行检查token的所有路径的数组
*/
const UN_CHECK_PATHS = ['/login', '/content','/detail'];


// token签名加密的私钥
const PRIVATE_KEY = 'yxh_token'