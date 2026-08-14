const asyncHandler=(fun)=> async(req,res)=>{
    try {
        await fun(req,res)
    } catch (err) {
        console.log("Actual error :-",err);
        
        res.status(err.code || 500).json({
            success:false,
            meassage:err.meassage
        })
    }
}

export {asyncHandler}