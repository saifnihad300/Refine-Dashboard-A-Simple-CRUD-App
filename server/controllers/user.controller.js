import User from '../mongodb/models/user.js'

const getAllUsers = async (req, res) =>{
    console.log("get all user is called")
     try{
        const users = await User.find({}).limit(req.query._end);
        res.status(200).json(users)
     } catch(error){
        res.status(500).json({message: error.message})
     }
}
const createUser = async (req, res) =>{

    try{
        const {name, email, avatar} = req.body;
        const userExists = await User.findOne({email})
    
        if(userExists) return res.status(200).json(userExists)
    
        const newUser = await User.create({
            name,
            email,
            avatar
        })
        res.status(200).json(newUser)

    }catch(error){
        res.status(500).json({message: error.message})
    }
}

const getUserInfoByID = async (req, res) => {
    console.log("Get User Info By ID is called!");
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id }).populate("allProperties");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

export {
    getAllUsers,
    createUser,
    getUserInfoByID
}