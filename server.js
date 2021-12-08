const express = require('express')
const app = express()
const fs = require('fs')
const penggunanya = require('./Data/pengguna')
const {v4: uuidv4} = require('uuid')
const JOI = require('@hapi/joi')

// membuat server
const PORT = process.env.PORT || 2021
app.listen(PORT, ()=> console.log(`Aplikasi berjalan pada port ${PORT}`))
app.use(express.json())

// simpan ke pengguna
function simpanPengguna(letak_file, isi){
    fs.writeFileSync(letak_file,JSON.stringify(isi), 'utf-8', (error)=>{
        if(error) return console.log('Ada kesalahan saat enambahkan data')
    })
}
// validasi
function validasiIsi(data){
    const aturan = {
        nama : JOI.string().min(3).max(20).required(),
        no_telp : JOI.string().min(12).max(15).required(),
        email:JOI.string().min(12).max(15).required()
    }
    return JOI.validate(data,aturan)
}

//create
app.post('/api/pengguna',(req,res)=>{
    const tambah_data = {
        id : uuidv4(),
        nama : req.body.nama,
        no_telp : req.body.no_telp,
        email : req.body.email
    }
    const {error} = validasiIsi(req.body)
    if(error) return res.status(202).send(error['details'][0]['message'])
    penggunanya.push(tambah_data)
    simpanPengguna('./Data/pengguna.json', penggunanya)
    res.send(tambah_data)
})

// read
app.get('/api/pengguna',(req,res)=>{
    const penggunaAll = penggunanya
    res.send(penggunaAll)
})

//cari berdaarkan namanya
app.get('/api/pengguna/:nama',(req,res)=>{
    let nama = req.params.nama
    const findNama = penggunanya.find(x=>x.nama === nama)
    if(!findNama) return res.status(404).send(`Data dengan nama ${nama} tidak ditemukan`)
    res.send(findNama)
})

// edit berdasarkan id
app.put('/api/pengguna/:id', (req,res)=>{
    idnya = req.params.id
    const Pengguna = penggunanya.find(y=>y.id === idnya )
    if(!Pengguna) return res.status(404).send(`Maaf tidak ada data dengan id ${idnya}`)
    Pengguna.nama = req.body.nama
    Pengguna.no_telp = req.body.no_telp
    Pengguna.email = req.body.email
    const {error}  = validasiIsi(req.body)
    if(error) return res.status(202).send(error.details[0]['message'])
    res.send(Pengguna)
    simpanPengguna('./Data/Pengguna.json', penggunanya)

})

// mengahpus berdasarkan id
app.delete('/api/pengguna/:id',(req,res)=>{
    idnya = req.params.id
    const findPengguna = penggunanya.find(z=>z.id === idnya)
    if(!findPengguna) return res.send(404).send(`Maaf tidak ada pengguna dengan id ${idnya}`)
    index = penggunanya.indexOf(findPengguna)
    penggunanya.splice(index,1)
    res.send(penggunanya)
})

