export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5555,
  jwtSecret: process.env.JWT_SECRET || 'aç1QfJ=--=3-194'
}
