var sentences = [
  "年轻人们因无法被世人理解而相聚一处, 因无法理解对方而分道扬镳. ",
  "哪里会有人喜欢孤独, 不过是不想失望罢了. ",
  "如果有人怀疑 <古兰经> 的真实性, 正由于书中没有骆驼, 就可以证实它是阿拉伯的...对穆罕默德来说, 骆驼是现实的一个组成部分, 他没有加以突出的理由; 相反的是, 一个伪造者, 旅游者, 阿拉伯民族主义者首先要做的是在每一页大谈骆驼和骆驼队. ",
  "\"和谐使人动情, 矛盾使人思考.\"",
  "\"海就在那里, 随时可以去死, 因此有了勇气再活一天.\""
  // 添加更多句子...
];

function randomSentence() {
  var sentence = sentences[Math.floor(Math.random() * sentences.length)];
  document.getElementById("random-sentence").innerHTML = sentence;
}

window.onload = randomSentence;