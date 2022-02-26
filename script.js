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
let totalHadiah = 40;
let dataPemenang = [];

const initData = () => {
  for (var i = 0; i <= totalHadiah - 1; i++) {
    $(".prize-pool").append(
      `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${listHadiah[i].nama_hadiah}</p></div>`
    );
  }
  console.log("init data");
};
const getDataKaryawan = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/karyawans`);
  let data = await response.json();
  data.map(function (e) {
    listKaryawan.push({ id_karyawan: e.id, nama_karyawan: e.nama_karyawan, nip: e.nip });
  });
  // console.log(data);
};

const getDataHadiah = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/hadiahs`);
  let data = await response.json();
  data.map(function (e) {
    listHadiah.push({ id_hadiah: e.id, nama_hadiah: e.nama_hadiah });
  });
  // console.log(data);
  initData();
};

const postPemenang = async () => {
  const formData = new FormData();
  dataPemenang.reverse();
  for (let index = 0; index < totalHadiah; index++) {
    formData.append('id_karyawan', dataPemenang[index].karyawan.id_karyawan);
    formData.append('id_hadiah', dataPemenang[index].hadiah.id_hadiah);
  }

  const response = await fetch(`http://192.168.1.115:8000/api/pemenang`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", formData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

getDataHadiah();
getDataKaryawan();

document.getElementById("start").onclick = function () {
  if (totalHadiah < listKaryawan.length) {
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
      postPemenang();
  }
    isRoll = !isRoll;
  } else {
    alert("Pemenang harus lebih banyak dari hadiah");
  }
};

function roll() {
  listPemenang = [];
  $(".prize-box").remove();
  for (let i = 0; i < totalHadiah; i++) {
    for (let j = 0; j < listKaryawan.length; j++) {
      const randomNumber = Math.floor(Math.random() * listKaryawan.length);
      if (!listPemenang.includes(listKaryawan[randomNumber])) {
        listPemenang.push({karyawan: listKaryawan[randomNumber], hadiah: listHadiah[j]});
      }
    }
    dataPemenang.push({karyawan: listPemenang[i].karyawan, hadiah: listPemenang[i].hadiah})
  }
  for (var i = 0; i <= totalHadiah - 1; i++) {
    $(".prize-pool").append(
      `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${listPemenang[i].hadiah.nama_hadiah}</p><br/><p class="pemenang">${listPemenang[i].karyawan.nama_karyawan} | ${listPemenang[i].karyawan.nip}</p></div>`
      );
    }
  }
