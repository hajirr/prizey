const acak = document.getElementById("play");
const refresh = document.getElementById("refresh");
const prizeBox = document.getElementsByClassName("prize-box");
const toAdd = document.createDocumentFragment();

let listHadiah = [];
let listKaryawan = [];
let listNip = [];
let listPemenang = [];
let isRoll = false;
let myInterval = null;  

const initData = () => {
  for (var i = 0; i <= listHadiah.length - 1; i++) {
    $(".prize-pool").append(
      `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${listHadiah[i]}</p></div>`
    );
  }
  console.log("init data");
};
const getDataKaryawan = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/karyawans`);
  let data = await response.json();
  data.map(function (e) {
    listKaryawan.push(e.nama_karyawan);
    listNip.push(e.nip);
  });
  console.log(data);
};

const getDataHadiah = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/hadiahs`);
  let data = await response.json();
  data.map(function (e) {
    listHadiah.push(e.nama_hadiah);
  });
  console.log(data);
  initData();
};

getDataHadiah();
getDataKaryawan();

document.getElementById("start").onclick = function () {
  if (listPemenang.length - 1 < listKaryawan.length) {
    if (!isRoll) {
      myInterval = setInterval(roll, 100);
      document.getElementById("start").innerHTML = " Stop";
      document.getElementById("start").className = "fa fa-stop";
      document.getElementById("start").style.backgroundColor = "red";
    } else {
      document.getElementById("start").innerHTML = " Start";
      document.getElementById("start").className = "fa fa-play";
      document.getElementById("start").style.backgroundColor = "#4caf50";
      clearInterval(myInterval);
    }
    isRoll = !isRoll;
  } else {
    alert("Pemenang harus lebih banyak dari hadiah");
  }
};

function roll() {
  listPemenang = [];
  $(".prize-box").remove();
  listPemenang.push(
    listKaryawan[Math.floor(Math.random() * listKaryawan.length)]
  );
  for (let i = 0; i < listPemenang.length; i++) {
    for (let j = 0; j < listKaryawan.length; j++) {
      const randomNumber = Math.floor(Math.random() * listKaryawan.length);
      if (!listPemenang.includes(listKaryawan[randomNumber])) {
        listPemenang.push(listKaryawan[randomNumber]);
      }
    }
  }
  for (var i = 0; i <= listHadiah.length - 1; i++) {
    $(".prize-pool").append(
      `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${listHadiah[i]}</p><br/><p class="pemenang">${listPemenang[i]}</p></div>`
    );
  }
}
