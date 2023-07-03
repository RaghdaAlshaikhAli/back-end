const NewsModel = require('../model/news.model')


const createNews = async (req,res) =>{
    try{
        const news = new NewsModel(req.body);
        if(req.file){
            NewsModel.image = req.file.path
        }
        const result = await news.save();
        res.status(201).json({
            status: 201,
            message: 'News created successfully',
            data: result,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });
    }
}

const showNews = async (req,res)=>{
    try
    {
        const news = await NewsModel.find({});
        res.status(200).json({
            status : 200,
            data: news,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
}

const showNew = async (req,res)=>{
    try
    {
        const {id} = req.params
        const news = await NewsModel.findById(id);
        if(!news){
            res.status(404).json({message:`can not find any news with ID : ${id}`})
        }
        res.status(200).json({
            status : 200,
            data: news,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

const updateNews = async (req,res)=>{
    try
    {
        const {id} = req.params
        const news = await NewsModel.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true
        });
        if(!news){
            res.status(404).json({message:`can not find any news with ID : ${id}`})
        }
        res.status(200).json({
            status : 200,
            data: news,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

const deleteNews = async (req,res)=>{
    try
    {
        const {id} = req.params
        const news = await NewsModel.findByIdAndDelete(id);
        if(!news){
            res.status(404).json({message:`can't find any news with ID : ${id}`})
        }
        res.status(200).json({
            status : 200,
            data: news,
        });
    }
    catch(error)
    {
        res.status(400).json({
            status : 400,
            message : error.message
        });        
    }
    
}

module.exports = {createNews, showNews, showNew, updateNews, deleteNews};
