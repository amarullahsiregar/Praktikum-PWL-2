import React, { Component } from "react";
import cheerio from "cheerio";
import axios from "axios";
import './App.css'
import logo from './ball.png';
let title = "Web Scraping | Berita Bola"

class App extends Component {
  state = { data: [] };
  

  async componentDidMount() {
    let data = [];
    let perpage = 12
    
    const pandit = await axios.get("https://cors-anywhere.herokuapp.com/https://www.panditfootball.com/")
    const $panditfootball = cheerio.load(pandit.data)
    let panditCount = 0
    
    $panditfootball("div.col-md-4 > article.news-block").each((i,element)=>{
      if (panditCount < perpage) {
        data.push({
          judul:$panditfootball(element).find("header > h3 > a").text(),
          gambar:$panditfootball(element).find("a > figure > img").attr("src"),
          waktu:$panditfootball(element).find("header > p").text().replace("/"," "),
          web_sumber:"https://www.panditfootball.com",
          url_asal:$panditfootball(element).find("a").attr("href")
        })
        panditCount++
      }
    })


    const detik = await axios.get("https://cors-anywhere.herokuapp.com/https://sport.detik.com/")
    const $detikCom = await cheerio.load(detik.data)
    let detikCount = 0
    
    $detikCom("div.m_content > ul > li > article.gtm_newsfeed_artikel").each((i, element)=>{
      let url = $detikCom(element).find("div.desc_nhl > a").attr("href")
      let sepakbola = $detikCom(element).find("div.desc_nhl > a").attr("href").slice(0,34)
      if (sepakbola ==="https://sport.detik.com/sepakbola/"&&detikCount < perpage) {
        data.push({
          judul:$detikCom(element).find("div.desc_nhl > a > h2").text(),
          gambar: $detikCom(element).find("div.ratio9_8 > div > a > img").attr("src"),
          waktu: $detikCom(element).find("div.desc_nhl > span.labdate").text().replace("detikSport","").replace("\n","").split(",")[1],
          web_sumber: "https://sport.detik.com",
          url_asal: url
        })
        detikCount++
      }
    })

    const goal = await axios.get("https://cors-anywhere.herokuapp.com/https://www.goal.com/id")
    const $goalcom = await cheerio.load(goal.data)

    let goalCount = 0
    $goalcom("section > div > article.type-article").each((i,element)=>{
      let ambilgambar = $goalcom(element).find("a > div.picture > nonscript")
      let waktugoal = $goalcom(element).find("footer > time").attr("datetime").split("T")
      if (goalCount < perpage) {
        data.push({
          judul:$goalcom(element).find("a > div.title > h3").text(),
          gambar:"https://d26bwjyd9l0e3m.cloudfront.net/wp-content/uploads/2014/02/Goal-Logo.jpg",
          waktu:waktugoal[0]+" "+waktugoal[1].split(":")[0]+":"+waktugoal[1].split(":")[1]+" WIB",
          web_sumber:"https://www.goal.com",
          url_asal:"https://www.goal.com"+$goalcom(element).find("a").attr("href")
        })
        goalCount++
      }
      // console.log("https://www.goal.com"+$goalcom(element).find("a").attr("href"))
    })
    
    const bola = await axios.get("https://cors-anywhere.herokuapp.com/https://www.bola.com")
    const $bolacom = await cheerio.load(bola.data)
    let bolaCount = 0

    $bolacom("div.articles--iridescent-list > article").each((i, element) => {
      let kategori = $bolacom(element).find("aside > header > a.articles--iridescent-list--text-item__category").text().trim();
      let judulFoto = $bolacom(element).find("aside > header > h4").text().trim().substr(0, 5);
      let judulVideo = $bolacom(element).find("aside > header > h4").text().trim().substr(0, 6);
      if (kategori!=="Ragam" && kategori !== "MotoGP" && kategori !== "E-sports" && kategori !== "NBA" &&bolaCount < perpage ) {
        if (judulFoto !== "FOTO:" && judulVideo !== "VIDEO:") {
          data.push({
            judul: $bolacom(element).find("aside > header > h4").text(),
            gambar: $bolacom(element).find("figure > a > picture > img").attr("data-src"),
            waktu: $bolacom(element).find("aside > header > span.articles--iridescent-list--text-item__datetime > time").text(),
            web_sumber: "https://bola.com",
            url_asal: $bolacom(element).find("aside > header > h4 > a").attr("href"),
          });
          bolaCount++;
        }
      }
    });

    this.setState({ data });
  }

  render() {
    return (
      <div className="container">
        <ul>
          <table>
            <th>
              <td class="logo-td">
                <div >
                  <img src={logo} class="App-logo" alt="logo" />
                </div>
              </td>
              <td>
                <h1 class="title">{title}</h1>
              </td>
            </th>
          </table>
          <div class='konten'>

            {this.state.data.map((data, i) => (          
              <div key={i} class="card">
                <a href={data.url_asal}>
                  <img class="gambar" src={data.gambar}alt="gambar" ></img>
                </a>
                <div class="isi">
                  <p class="judul">{data.judul}</p>
                  <p class="waktu">{data.waktu}</p>
                  <a href={data.web_sumber}>
                    <p class="sumber">Sumber : {data.web_sumber.replace("https://", "")}</p>
                  </a>
                </div>
              </div>
            ))}

        </div>
        </ul>
      </div>
      
    );
  }
}

export default App;
