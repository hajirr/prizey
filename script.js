const acak = document.getElementById("play");
const refresh = document.getElementById("refresh");
const prizeBox = document.getElementsByClassName("prize-box");
const toAdd = document.createDocumentFragment();

const data = [
  "Muhajir",
  "Nahda",
  "Reza",
  "Madsari",
  "Muhayanah",
  "Herdi",
  "Ikbal",
  "Oji",
  "Tajoe",
  "Ayat",
  "Asep",
  "Adan",
  "Dika",
  "Sisil",
  "Dita",
  "Yusril",
  "Adika",
];

let newData = [];
let pemenang = 10;
let isRoll = false;
let myInterval = null;

document.getElementById("start").onclick = function () {
    if(!isRoll) {
        myInterval = setInterval(roll, 100)
        document.getElementById("start").innerHTML = ' Stop';
        
    } else {
        document.getElementById("start").innerHTML = ' Acak';
        clearInterval(myInterval);
    }
    isRoll = !isRoll;
}

function roll() {
  if (pemenang < data.length) {
    $(".prize-box").remove();
    newData = [];
    newData.push(data[Math.floor(Math.random() * data.length)]);
    for (let i = 0; i < pemenang; i++) {
      for (let j = 0; j < data.length; j++) {
        const randomNumber = Math.floor(Math.random() * data.length);
        if (!newData.includes(data[randomNumber])) {
          newData.push(data[randomNumber]);
        }
      }
    }
    for (var i = 0; i <= pemenang; i++) {
      $(".prize-pool").append(
        `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${newData[i]}</p></div>`
      );
    }
  } else {
    alert("Peserta harus lebih banyak dari jumlah pemenang");
  }
}
