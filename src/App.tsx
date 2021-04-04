import { FormControl, List, TextField } from '@material-ui/core';
import React,{useState, useEffect} from 'react';
import styles from './App.module.css';
import { db } from "./firebase";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos"
import TaskItem from './TaskItem';
import { makeStyles } from "@material-ui/styles";
import { auth } from "./firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin:"auto",
    width:"40%",
  }
})

const App:React.FC = (props: any) => {
  const [tasks, setTasks] = useState([{id:"",title:""}]);
  const [input, setInput] = useState("");
  const classes = useStyles();

  useEffect(()=> {
    const unSub = auth.onAuthStateChanged((user)=>{
      // userが存在しない場合は、loginに遷移
      !user && props.history.push("login");
    });
    return ()=> unSub();
  })

  // アプリケーションを開いた時に一度だけ実行
  useEffect(()=> {
    // DBからtasksコレクションの中身を取得　snapshot引数に取得したDBの内容を入れる
    const unSub = db.collection("tasks").onSnapshot((snapshot)=>{
      //setTasks変数にmap関数を使いidとtitleをsetしていく
      setTasks(
        snapshot.docs.map((doc)=> ({id: doc.id, title: doc.data().title }))
    );
      });
    // このreturn(クリーンアップ関数)はDOMがアンマウントされた時に実行される
    return ()=> unSub();
  }, []);

  const newTask = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    db.collection("tasks").add({title: input})
    setInput("");
  }

  return (
  <div className={styles.app__root}>
    <h1>ToDo App by React/Firebase</h1>
    <button className={styles.app__logout}
    onClick={
      async () => {
        try { await auth.signOut();
          props.history.push("login");
        }
        catch(error){
          alert(error.message);
        }
      }
    }>
      <ExitToAppIcon />
    </button>
    <br />
    <FormControl>
      <TextField
      className={classes.field}
      InputLabelProps={{
        shrink: true,
      }}
      label="New task ?"
      value={input}
      onChange={(e : React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => setInput(e.target.value)}
      ></TextField>
    </FormControl>
    <button className={styles.app__icon} disabled={!input} onClick={newTask}>
      <AddToPhotosIcon />
    </button>
    <List className={classes.list}>
    {tasks.map((task) => (
    <TaskItem key={task.id} id={task.id} title={task.title}/>
    ))}
    </List>
    </div>
  );
};

export default App;

// onSnapShot関数
// DB（FireStore）に変更があった際に、毎回内容を取得してくれる
