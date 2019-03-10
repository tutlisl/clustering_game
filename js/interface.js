// スクリプト読み込み時に実行される
var lCanvas = $('#tutorial').get(0);
var context = lCanvas.getContext('2d');

var clusterNum = 4; // 左画面における識別のためのクラスタ数
var relX, relY;

var interfaceArray;  // 左画面のインターフェースを構成する丸を格納
var initialInterface;  // インターフェースの初期状態を格納
var interfaceHistory;  // インターフェースの履歴を格納 
var clusterMeanHistory;  // インターフェースのクラスタ中心を格納

var resMap;
var dataPoint;

var dragging = false; //ドラッグ中かを示す変数
var leftFlag;

lCanvas.addEventListener('mousedown', onDown, false);
lCanvas.addEventListener('mousemove', onMove, false);
lCanvas.addEventListener('mouseup', onUp, false);

repaint();
turnCanvas(false);


function turnCanvas(turnOn){
  if(turnOn){
    $('#tutorial').css('visibility', 'visible');
    $('#tutorial2').css('visibility', 'visible');
  }else{
    $('#tutorial').css('visibility', 'hidden');
    $('#tutorial2').css('visibility', 'hidden');
  }
}

// canvas等の大きさを調整
function adjustComponents(){
  $('#tutorial').attr('width', $('#div1').width()/2.1);
  $('#tutorial').attr('height', $('#div1').height());
  $('#tutorial2').attr('width', $('#div1').width()/2.1);
  $('#tutorial2').attr('height', $('#div1').height());
}

function findCircle(arr, x, y, r){
  var res = null;
  for (let i = 0; i < arr.length; i++) {
    const ele = arr[i];
    if(Math.sqrt(Math.pow(ele.x - x, 2) + Math.pow(ele.y - y, 2)) < r){
      res = i;
    }
  }
  return res;
}

// 決定ボタンを押したときに呼ばれる
function init() {

  adjustComponents();  //コンポーネントの大きさを設定する
  turnCanvas(true);  //canvasを可視状態にする

  // サーバーから送られてきたデータをパースする
  var gbArray = JSON.parse(getData());
  interfaceArray = [];
  for (let i = 0; i < gbArray.length; i++) {
    const gb = gbArray[i];
    interfaceArray.push(ColorInterface.create(i, fixedR, gb.point[0], gb.point[1]));
  }
  interfaceHistory = [];
  clusterMeanHistory = [];
  clusterMeanHistory.push(ColorInterface.calcClusterMean(interfaceArray));
  initialInterface = ColorInterface.copyArray(interfaceArray);
  repaint();
  leftFlag = true;
}

function onDown(e) {
  // クリックされた位置の相対座標を取得
  var x = e.clientX - lCanvas.getBoundingClientRect().left;
  var y = e.clientY - lCanvas.getBoundingClientRect().top;
  // 選択されたオブジェクトの要素番号を取得
  var selectedIndex = findCircle(interfaceArray, x, y, radius);
  dragging = selectedIndex !== null;
  if(!dragging) return;
  relX = interfaceArray[selectedIndex].x - x;
  relY = interfaceArray[selectedIndex].y - y;
  //表示の関係で選択したものが一番最後に来るようにする。
  interfaceArray.push(ColorInterface.copyArray(interfaceArray)[selectedIndex]);
  interfaceArray.splice(selectedIndex, 1);
}

function onMove(e){
  // 動かしている最中は動かしているものが配列の後ろに来るず
  var selectedIndex = interfaceArray.length - 1;
  var x = e.clientX - lCanvas.getBoundingClientRect().left;
  var y = e.clientY - lCanvas.getBoundingClientRect().top;
  if (!dragging) return;
  interfaceArray[selectedIndex].x = x + relX;
  interfaceArray[selectedIndex].y = y + relY;
  repaint();
}

function onUp(e){
  if(!dragging) return;
  //動かしたものは配列の後ろにある
  var selectedIndex = interfaceArray.length - 1;
  interfaceArray[selectedIndex].label = interfaceArray[selectedIndex].allocateUserLabel();
  clusterMeanHistory.push(ColorInterface.calcClusterMean(interfaceArray));
  interfaceHistory.push(ColorInterface.copyArray(interfaceArray)[selectedIndex])
  dragging = false;
}

// 軸を描画する
function drawLeftAxis(){
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  // 横軸
  context.beginPath();
  context.moveTo(0, lCanvas.height/2);
  context.lineTo(lCanvas.width, lCanvas.height/2);
  context.stroke();
  // 縦軸
  context.beginPath();
  context.moveTo(lCanvas.width/2, 0);
  context.lineTo(lCanvas.width/2, lCanvas.height);
  context.stroke();
}

function drawCircle(obj){
  // 円を塗りつぶす
  if("getIntG" in obj){
    context.fillStyle = 'rgba('+obj.r+','+obj.getIntG()+','+obj.getIntB()+',1)';
  }else{
    context.fillStyle = 'rgba('+obj.r+','+Math.round(obj.g*255)+','+Math.round(obj.b*255)+',1)';
  }
  context.beginPath();
  context.arc(obj.x, obj.y, radius, 0, Math.PI*2, false);
  context.fill();
  // 円の縁取り
  context.strokeStyle = 'rgba(0, 0, 0,1)';
  context.beginPath();
  context.arc(obj.x, obj.y, radius, 0, Math.PI*2, false);
  context.stroke();
}
  
function repaint(){
  context.clearRect(0, 0, lCanvas.width, lCanvas.height);
  drawLeftAxis();
  if(typeof interfaceArray === "undefined"){
    return;
  }
  for(var i=0; i<interfaceArray.length; i++){
    drawCircle(interfaceArray[i]);
  }
}
