const mongoose = require('mongoose');

const Question=require('../models/question');
const Option=require('../models/option');

//add Option Controller
module.exports.addOption = async function(req,res){
    try {
        let question =await Question.findById(req.params.id);
        if(question){
            let option = await Option.create({
                text:req.body.text,
                votes:req.body.votes,
                question:req.params.id
            });
            
            option.link_to_vote="http://localhost:8000/options/"+option.id+"/add_vote";
            option.save();
            question.options.push(option);
            question.save();
            return res.json({option, data:{"message": "Option Created Sucessfully!"}});
        }
        return res.json({question});

    } catch (error) {
        console.log(error);
        return;
    }
};

//add vote(Increment the vote)
module.exports.add_Vote=function(req, res){
    Option.findByIdAndUpdate(req.params.id, {$inc:{votes:1}},{new:true}, function(err, newOption){
        if(err){
          console.error("Error",err);
          return res.redirect("/");
        }
        
        if(newOption){
            return res.json({data:{
                option: newOption,
                message: "Vote added Successfully!"
            }});
        }
        else{
            return res.json({data:{
                message: "Not Possible!"
            }});
        }
    });
}



//delete option
module.exports.deleteOption= async function(req,res){

    try {
        let option= await Option.findById(req.params.id);

        let question_id=option.question;
        option.remove();
        
        let question= await Question.findById(question_id);

        question.options.remove(req.params.id);
        question.save();
        return res.json({
            message: "Option Deleted Sucessfully!",
        });
    } catch (error) {
        console.log(error);
        return;
    }
};



// prevention of deletion of options if has votes

module.exports.preventdeleteOption= async function(req,res){

    
};


