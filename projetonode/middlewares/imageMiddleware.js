const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    // CASO NÃO FUNCIONE MUDE DE REQ PARA REQUEST.
    fileFilter: (request, file, next) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png'];


        if (allowed.includes(file.mimetype)) {
            next(null, true);
        } else {
            next({ message: 'Arquivo não suportado' }, false);
        }
    }
}

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (request, response, next) => {
    // CASO NÃO FUNCIONE MUDE DE REQ PARA REQUEST.
    if(!request.file) {
        next();
        return;
    }

    const ext = request.file.mimetype.split('/')[1];

    let filename = `${uuid.v4()}.${ext}`;

    request.body.photo = filename;

    const photo = await jimp.read(request.file.buffer);

    await photo.resize(800, jimp.AUTO);

    await photo.write(`./public/media/${filename}`);

    next();
}