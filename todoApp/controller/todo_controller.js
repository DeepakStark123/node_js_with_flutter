const ToDoService = require("../services/todo_services");
const UserService = require("../services/user_services");

exports.createToDo = async (req, res, next) => {
  try {
    const { userId, title, desc } = req.body;
    const isUserExist = await UserService.checkUserById(userId);
    if (isUserExist == false) {
      return res
        .status(200)
        .json({ status: false, error: `User with id ${userId} not exist` });
    }
    let todoData = await ToDoService.createToDo(userId, title, desc);
    res.json({ status: true, success: todoData });
  } catch (error) {
    console.log("CreateToDo err---->", error);
    next(error);
  }
};

exports.getToDoList = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const isUserExist = await UserService.checkUserById(userId);
    if (isUserExist == false) {
      return res
        .status(200)
        .json({ status: false, error: `User with id ${userId} not exists` });
    }
    let todoData = await ToDoService.getUserToDoList(userId);
    res.json({ status: true, success: todoData });
  } catch (error) {
    console.log("GetToDoList err---->", error);
    next(error);
  }
};

exports.deleteToDo = async (req, res, next) => {
    try {
      const { id } = req.body;
      var itemExist = await ToDoService.checkToDoById(id);
      console.log("ItemExist Exist ==>", itemExist);
      if (!itemExist) {
        console.log(`Item with id ${id} not exists`);
        return res
          .status(200)
          .json({ status: false, error: `Item with id ${id} not exists` });
      }
      let deletedData = await ToDoService.deleteToDo(id);
      res.json({ status: true, success: deletedData });
    } catch (error) {
      console.log("DeleteToDo Exceptions---->", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
