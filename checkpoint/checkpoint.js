async function getData(areaId = 136, cid = [11034, 11288]) {
    let api = 'https://szwj.borycloud.com/ilhapi/wjw/checkpoint/list?page=1&areaId=' + areaId.toString()
    let req = new Request(api)
    req.method = "post"
    let json = await req.loadJSON()
    let data = []

    for (let i = 0; i < json["data"].length; i++) {
        if (cid.indexOf(json["data"][i]["id"]) <= -1) {
            continue
        }

        data.push({
            "name": json["data"][i]["name"],
            "status": json["data"][i]["status"],
            "serve": json["data"][i]["serverTime"]
        })
    }
    return data
}

async function renderHeader(widget, title, color = false) {
    widget.addSpacer(10)
    let header = widget.addStack()
    header.centerAlignContent()
    let _title = header.addText(title)
    if (color) _title.textColor = color
    _title.textOpacity = 0.7
    _title.font = Font.boldSystemFont(12)
    widget.addSpacer(10)
    return widget
}


let w = new ListWidget()


let areaid = 136
let params = [11034, 11288]
if (args.widgetParameter) {
    let ps = args.widgetParameter.split("#")
    log(ps)

    if (ps.length == 2) {
        areaid = parseInt(ps[0])
        params = ps[1].split(";").map(function(item, index, ary) {
            return parseInt(item);
        })
    }
}


await renderHeader(w, "核酸检测")
let colors = [Color.black(), Color.gray(), Color.green(), Color.yellow(), Color.red()]

let data = await getData(areaid, params)
data.slice(0, 3).map(d => {
    const cell = w.addStack()
    cell.centerAlignContent()
    const cell_box = cell.addStack()
    cell_box.size = new Size(15, 15)

    let color = Color.black()
    if (d["status"] <= 4) {
        color = colors[d["status"]]
    }
    cell_box.backgroundColor = color

    cell.addSpacer(10)
    const cell_text = cell.addText(d['name'] + " " + d["serve"])
    cell_text.font = Font.lightSystemFont(16)
    w.addSpacer(10)
})

w.addSpacer()
w.presentMedium()
