let widget = new ListWidget();

// configs
let weeks = 8;
let weeknames = ["Sun", "Mon", "Thu", "Wed", "Thr", "Fri", "Sat"]

let username = "o98k-ok"
if (args.widgetParameter){
  username = args.widgetParameter
}


// get bing img url
let url = "https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US";
let img = new Request(url);
let imginfo = await img.loadJSON()

url = "https://www.bing.com" + imginfo["images"][0]["url"]


// request for backgroud image
let req = new Request(url);
let image = await req.loadImage();
widget.backgroundImage = image;


// get request gap
let end = new Date();
let start = new Date();
let days = (weeks-1)*7 + end.getDay() + 1;
start.setDate(start.getDate() - days);

let info = new DateFormatter();
info.dateFormat = "yyyy-MM-dd"
let startFormat = info.string(start)
let endFormat = info.string(end)

// request api
let usrinfo = new Request(`https://github-contributions.vercel.app/api/v1/${username}`);
let json = await usrinfo.loadJSON()
let array = json["contributions"].filter(myFunction)

function myFunction(value, index, array) {
  return value["date"] > startFormat && value["date"] <= endFormat
}

// main table config
let lenth = array.length
let stack = widget.addStack();
stack.spacing = 2;

let row = stack.addStack();
row.layoutVertically();
row.spacing = 2;
row.topAlignContent()
for (let i=0; i<7; i++) {
  let cell = row.addStack();
  cell.size = new Size(50, 17);
  cell.addText(weeknames[i])
}


for (let i=0; i<array.length; i++) {
  if (i%7 == 0) {
    row = stack.addStack();
    row.layoutVertically();
    row.spacing = 2;
  }
  let cell = row.addStack();
  cell.size = new Size(17, 17);
  cell.cornerRadius = 5;
  cell.backgroundColor = new Color(array[array.length-i-1]["color"]);
}

widget.presentMedium()
