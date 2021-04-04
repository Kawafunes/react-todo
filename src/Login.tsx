import React, {useState,useEffect} from 'react'
import styles from "./Login.module.css"
import {Button, FormControl,TextField,Typography} from "@material-ui/core";
import {auth} from "./firebase";

const Login:React.FC = (props: any) => {
    // 新規登録か、ログインかを切り替えるboolean　trueならログイン、falseなら登録
    const [isLogin, setIsLogin] = useState(true);
    // email,passwordのstateを管理する
    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    
    //userがログインやログアウトなど認証関係に変更があった際に呼ばれる
    // userの中身に情報があれば
    // pushメソッド　＝　指定pathに遷移させる
    useEffect(()=>{
        const unSub = auth.onAuthStateChanged((user)=>{
            user && props.history.push("/");
        });
        return () => unSub();
    },[props.history]);

    return<div className={styles.login__root}>
        <h1>{isLogin ? "Login" : "Register"}</h1>
        <br />
        <FormControl>
            <TextField
            InputLabelProps={{
                shrink:true,
            }}
            name="email"
            label="E-mail"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
            }}
            />
        </FormControl>
        <br />
        <FormControl>
            <TextField
            InputLabelProps={{
                shrink:true,
            }}
            name="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
            }}
            />
        </FormControl>
        <br />
        <Button
        variant="contained" color="primary" size="small" onClick={
            isLogin ? async () => {
                try {
                    await auth.signInWithEmailAndPassword(email,password);
                    props.history.push("/")
                }catch (error){
                    alert(error.message)
                }
            } : async () => {
                try{
                    await auth.createUserWithEmailAndPassword(email,password);
                    props.history.push("/")
                } catch (error){
                    alert(error.message);
                }
            }
        }>
            
            {isLogin ? "Login" : "Register"}
        </Button>
        <br />
        <Typography align="center">
            <span onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Create new account" : "Back to login"}
            </span>
        </Typography>

        </div>;
};

export default Login
