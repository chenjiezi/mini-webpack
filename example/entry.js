import message from "./message.js";
import "./index.css";
// 将message的内容 输出到页面中
let p = document.createElement("p");
p.innerHTML = message;
document.body.appendChild(p);
