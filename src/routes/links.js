import express from 'express';
const router= express.Router();
import pool from '../db.js';
import { isLoggedIn } from '../lib/auth.js';


router.get ('/add' ,isLoggedIn, (req,res)=>{
res.render('links/add');    
});

router.post('/add',isLoggedIn, async (req, res)=>{
    const { title,url,description }= req.body;//obtiene las propiedades del body
    const newLink ={//guarda los datos en un nuevo objeto 'newLink'
        title,
        url,
        description,
        user_id: req.user.id //eh aqui la solucion
        };
    await pool.query('INSERT INTO links set ?',[newLink]);
    req.flash('success','Link saved succesfully');
    res.redirect('/links');
});

router.get ('/',isLoggedIn, async (req, res)=>{
    const [links] = await pool.query('SELECT * FROM links Where user_id = ?',[req.user.id]);
    res.render("links/list", {links});//para que se vean los links
    
});

router.get('/delete/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const [links] = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
    
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id',isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body; 
    const newLink = {
        title,
        description,
        url,
}
await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
req.flash('success', 'Link Updated Successfully');
res.redirect('/links');
});;



export default router;