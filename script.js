const acak = document.getElementById("play");
const refresh = document.getElementById("refresh");
const prizeBox = document.getElementsByClassName("prize-box");
const toAdd = document.createDocumentFragment();

let listHadiah = [];
let listRandomKaryawan = [];
let listKaryawan = [];
let listPemenang = [];
let dataSession = {};
let dataPemenang = [];
let isRoll = false;
let isLoading = false;
let isNextSession = false;

const initData = () => {
  for (var i = 0; i <= dataSession.jumlah_hadiah - 1; i++) {
    $(".prize-pool").append(
      `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${listHadiah[i].nama_hadiah}</p></div>`
    );
  }
};

const getDataKaryawan = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/karyawans`);
  let data = await response.json();
  data.map(function (e) {
    listKaryawan.push({
      id_karyawan: e.id,
      nama_karyawan: e.nama_karyawan,
      nama_pt: e.nama_pt,
    });
  });
};

const getDataRandomKaryawan = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/random_karyawan`);
  let data = await response.json();
  data.map(function (e) {
    listRandomKaryawan.push({
      id_karyawan: e.id,
      nama_karyawan: e.nama_karyawan,
      nama_pt: e.nama_pt,
    });
  });
};

const getDataSession = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/session`);
  dataSession = await response.json();
  document.getElementById("session").innerHTML = dataSession.session_name;
};

const getDataNext = async () => {
  const response = await fetch(`http://192.168.1.115:8000/api/next`);
  dataNext = await response.json();
};

const getDataHadiah = async () => {
  getDataSession();
  const response = await fetch(`http://192.168.1.115:8000/api/hadiahs`);
  let data = await response.json();
  data.map(function (e) {
    listHadiah.push({ id_hadiah: e.id, nama_hadiah: e.nama_hadiah });
  });
  initData();
};

getDataHadiah();
getDataRandomKaryawan();
getDataKaryawan();

const hiddenButton = () => {
  if (isNextSession) {
    document.getElementById("start").style.visibility = "hidden";
  } else {
    document.getElementById("start").style.visibility = "visible";
  }
}

const loadingButton = () => {
  if (isLoading) {
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("next").style.visibility = "hidden";
    document.getElementById("upload").style.visibility = "visible";
  } else {
    document.getElementById("upload").style.visibility = "hidden";
    document.getElementById("start").style.visibility = "visible";
    document.getElementById("next").style.visibility = "visible";
  }
}

const postPemenang = async () => {
  isLoading = true;
  loadingButton();
  const formData = new FormData();
  for (let index = 0; index < dataSession.jumlah_hadiah; index++) {
    formData.append("id_karyawan", listPemenang[index].karyawan.id_karyawan);
    formData.append("id_hadiah", listPemenang[index].hadiah.id_hadiah);
    ``;
    const response = await fetch(`http://192.168.1.115:8000/api/pemenang`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  isLoading = false;
  isNextSession = true;
  loadingButton();
  hiddenButton();
};

document.getElementById("next").onclick = function () {
  getDataNext();
  location.reload();
  isNextSession = false;
  hiddenButton();
  
};

document.getElementById("start").onclick = function () {
  if (dataSession.jumlah_hadiah <= listRandomKaryawan.length) {
    if (!isRoll) {
      myInterval = setInterval(roll, 100);
      document.getElementById("start").innerHTML = "Berhenti";
      document.getElementById("start").style.backgroundColor = "red";
    } else {
      document.getElementById("start").innerHTML = "Mulai";
      document.getElementById("start").style.backgroundColor = "#4caf50";
      clearInterval(myInterval);
      winner();
      postPemenang();
    }
    isRoll = !isRoll;
  } else {
    alert("Pemenang harus lebih banyak dari hadiah");
  }
};

function winner() {
  listPemenang = [];
  $(".prize-box").remove();
  for (var i = 0; i <= dataSession.jumlah_hadiah - 1; i++) {
    listPemenang.push({
      karyawan: listRandomKaryawan[i],
      hadiah: listHadiah[i],
    });
    $(".prize-pool").append(
      `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${listPemenang[i].hadiah.nama_hadiah}</p><br/><p class="pemenang">${listPemenang[i].karyawan.nama_karyawan}</p><p>${listPemenang[i].karyawan.nama_pt}</p></div>`
    );
  }
}

function roll() {
  listPemenang = [];
  $(".prize-box").remove();
  for (let i = 0; i < dataSession.jumlah_hadiah; i++) {
    for (let j = 0; j < listKaryawan.length; j++) {
      const randomNumber = Math.floor(Math.random() * listKaryawan.length);
      if (!listPemenang.includes(listKaryawan[randomNumber])) {
        listPemenang.push({
          karyawan: listKaryawan[randomNumber],
          hadiah: listHadiah[j],
        });
      }
    }
  }
  for (var i = 0; i <= dataSession.jumlah_hadiah - 1; i++) {
    $(".prize-pool").append(
      `<div class="prize-box"><img src="gift.png" alt="gift" /><p>${listHadiah[i].nama_hadiah}</p><br/><p class="pemenang">${listPemenang[i].karyawan.nama_karyawan} | ${listPemenang[i].karyawan.nama_pt}</p></div>`
    );
  }
}
