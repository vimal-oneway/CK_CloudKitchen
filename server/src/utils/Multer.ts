import multer from 'multer'
import path from 'path'
import fs from 'fs'

const whitelist = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const dirPath = './src/uploads'
const maxSize = 3 * 1024 * 1024

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(dirPath)) {
      // Create the directory if it doesn't exist
      fs.mkdirSync(dirPath)
    }
    cb(null, dirPath)
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    if (!whitelist.includes(file.mimetype)) {
      return cb(new Error('file is not allowed'))
    }
    cb(null, true)
  },
})

export const uploaderSingle = (fieldName: string) => upload.single(fieldName)

export const uploaderMultiple = upload.array('images', 5)
