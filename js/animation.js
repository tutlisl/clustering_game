  var rCanvas = document.getElementById("tutorial2");
  var rContext = rCanvas.getContext('2d');
function playAnime(){
  console.log("playAnimation");
  // 左画面にオブジェクトが表示されているかチェック
  if(typeof leftFlag === "undefined" || leftFlag === false){
    console.log("左画面にオブジェクトがない");
    return;
  }
 // alert("アニメーション再生");
alert("playanima");

  // 右画面におけるユーザ操作のクラスタ中心とクラスタリング結果のデータ点、クラスタ中心の位置変換

// 答え合わせを押したときに呼ばれる
// 左画面が表示されているかのチェック
// = データ点の変数がある
  var resMap = JSON.parse(learn_json_str);
  console.log(learn_json_str);
  if(resMap["success"] !== true){console.log("受信失敗");return;}

  var dataPoint = [];
  //var centroid = [];
  function makeDataPos(x, y, g, b, id){
	this.x = x;
	this.y = y;
	this.g = g;
	this.b = b;
	this.id = id;
  }
  // 右画面におけるデータの位置座標とクラスタへの参照ラベルを取得
  for(var i=0; i<colorPosData.length; i++){
    dataPoint.push(new makeDataPos(userOprHistory[i].g/255, userOprHistory[i].b/255, userOprHistory[i].g, userOprHistory[i].b, userOprHistory[i].id));
	convRgbToPos(dataPoint[i], dataPoint[i].x, dataPoint[i].y);
  }
  // データ点をすべてRGBから画面上の位置へ変換
  function convRgbToPos(obj, colorG, colorB){
    //obj.x = Math.round(colorG * (rCanvas.width - 2*radius)) + radius;
    //obj.y = rCanvas.height - (Math.round(colorB*(rCanvas.height-2*radius))+radius);

	obj.x = colorG * 255;
    obj.y = colorB * 255;


	obj.x = obj.x*((rCanvas.width*0.8)/255) + (rCanvas.width*0.1);
    obj.y = obj.y*((rCanvas.height*0.8)/255) + (rCanvas.height*0.1);
    obj.y = rCanvas.height - obj.y; //上下反転変換

	console.log(colorG + ", " + colorB);
	console.log(obj.x + ", " + obj.y);
    //obj.x = Math.round(resMap["result"][i]["centroid"][j]["x"] * (wih - 2*rightRadius)) + rightRadius;
    //obj.y = hgh - (Math.round(resMap["result"][i]["centroid"][j]["y"]*(hgh-2*rightRadius))+rightRadius);
  }

  // 描画
      /* 描画フロー */
  var t = 0;
  var count = 0;
  var rightRadius = 15;
 // var r = 10;
  // データポイントのプロット関数
  function plotDataPoint(t){
    var resultIndex = t-1;
	if(resultIndex >= resMap["iters"]){resultIndex = resMap["iters"]-1;}

	//var labelList = Array(resMap["result"][resultIndex][labels].length);
    function returnClusterLabel(label){
	  var no;
	  var index;
	  for(var i=0; i<resMap["result"][resultIndex]["labels"].length; i++){
	    no = resMap["result"][resultIndex]["labels"][i];
		if(no === label){
		  index = i;
		  break;
		}
	  }
	  return index;
	}
	if(resultIndex === -1){
		for(var i=0; i<dataPoint.length; i++){
			//var clusterLabel = returnClusterLabel(resMap["result"][resultIndex]["allocation"][dataPoint[i].id]);
			//alert("i:"+i+","+dataPoint[i].id);// + ","+clusterLabel);
			//alert("cL"+clusterLabel + ", K:" + resMap["result"][resultIndex]["clusterNum"]);
			//alert("cL"+clusterLabel);
			var g = Math.round(dataPoint[i].g);
			var b = Math.round(dataPoint[i].b);
			//	  drawRightPCircle(dataPoint[i].x, dataPoint[i].y, dataPoint[i].g, dataPoint[i].b);
			drawRightPCircle(dataPoint[i].x, dataPoint[i].y, g, b);
			console.log(dataPoint[i].x);//+"," +dataPoint[i].y+","+ i)+
			// 描画関数
			// plot(dataPoint.x, dataPoint.y, cluster[dataPoint.id].g, cluster[dataPoint.id].b)
		}
	}
	else{
		for(var i=0; i<dataPoint.length; i++){
			var clusterLabel = returnClusterLabel(resMap["result"][resultIndex]["allocation"][dataPoint[i].id]);
			//alert("i:"+i+","+dataPoint[i].id);// + ","+clusterLabel);
			//alert("cL"+clusterLabel + ", K:" + resMap["result"][resultIndex]["clusterNum"]);
			//alert("cL"+clusterLabel);
			var g = Math.round(resMap["result"][resultIndex]["centroid"][clusterLabel]["x"] * 255);
			var b = Math.round(resMap["result"][resultIndex]["centroid"][clusterLabel]["y"] * 255);
		//	  drawRightPCircle(dataPoint[i].x, dataPoint[i].y, dataPoint[i].g, dataPoint[i].b);
			drawRightPCircle(dataPoint[i].x, dataPoint[i].y, g, b);
			console.log(dataPoint[i].x);//+"," +dataPoint[i].y+","+ i)+
			// 描画関数
			// plot(dataPoint.x, dataPoint.y, cluster[dataPoint.id].g, cluster[dataPoint.id].b)
		}
	}
  }
  function plotClusterCenter(t){
  	if(t == 0){return;}
//alert("ttt");
    var resultIndex = t - 1;
	if(resultIndex+1 >= resMap["iters"]){resultIndex = resMap["iters"]-2;}

	var clusterNum = resMap["result"][resultIndex]["centroid"].length;
	//var x = new Array(clusterNum);
	//var y = new Array(clusterNum);
	//var g = resMap["result"][t]["centroid"];
	//var b = new Array(clusterNum);
	//alert(resMap["result"][0]["clusterNum"]+"aaaaaaaaaa"+clusterNum);
	//alert(resMap["iters"]);
	var centroid = [];
	//alert(centroid.length);
	for(var i=0; i<clusterNum; i++){
	  var g = resMap["result"][resultIndex]["centroid"][i]["x"];
	  var b = resMap["result"][resultIndex]["centroid"][i]["y"];
	  centroid.push(new makeDataPos(g, b, Math.round(g*255), Math.round(b*255), i));
	  //centroid.push(new makeDataPos(g, b, 255, 255, i));
	  convRgbToPos(centroid[i], g, b);
	  //alert(g + ", " + b);
	  //alert(centroid[i].g + ", " + centroid[i].b);
	 // alert(centroid[i].x + ", " + centroid[i].y + ", " + centroid[i].g + ", " + centroid[i].b);
  	  drawRightCCircle(centroid[i].x, centroid[i].y, centroid[i].g, centroid[i].b);
	}

  }
  // データアイコン
  function drawRightPCircle(x, y, colorG, colorB, roundColorG, roundColorB){
    // 円を塗りつぶす
    rContext.fillStyle = 'rgba('+fixedR+','+colorG+','+colorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.fill();

    // 円の縁取り
	//alert(rContext.lineWidth);
	rContext.lineWidth = 1;
    rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.stroke();
  }
  // クラスタアイコン
  function drawRightCCircle(x, y, colorG, colorB, roundColorG, roundColorB){
    // 円を塗りつぶす
    rContext.fillStyle = 'rgba('+fixedR+','+colorG+','+colorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.fill();

    // 円の縁取り
	//alert(rContext.lineWidth);
	rContext.lineWidth = 5;
    rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius-10, 0, Math.PI*2, false);
    rContext.stroke();

	rContext.lineWidth = 1;
    rContext.strokeStyle = 'rgba(128,'+ roundColorG +','+ roundColorB+',1)';
    rContext.beginPath();
    rContext.arc(x, y, rightRadius, 0, Math.PI*2, false);
    rContext.stroke();
  }

  // アニメーション描画のために呼ばれ続ける
  function render() {
    // Canvas全体をクリア
    rContext.clearRect(0, 0, rContext.width, rContext.height);

    // 要素を描画する


    // 左画面描画 ユーザオブジェクトのx,y,g,b

	// 右画面データ点描画
	plotDataPoint(t);
	// 右画面クラスタ中心描画
	plotClusterCenter(t);

	// 右画面ユーザ操作によるクラスタ中心

    // データ点は位置固定、
	count++;
	if(count % 3 == 0){
		t++;
		console.log("t:"+t);
	}

    // このrender関数を繰り返す
    // 下記どちらかを使った場合は、外側でrender()を実行する※1（もしくは即時実行）
    // setTimeout(render, 100);
    // requestAnimationFrame(render);
    }
    /* ※1 */
    // render();

    /* render()関数を繰り返す */
    /* setTimeout、requestAnimationFrameではなく、setIntervalを使う場合 */
    //setInterval(render, 500);
	var loopNum = userHistory.length / 4;
	if(loopNum < resMap["iters"]){
	  loopNum = resMap["iters"];
	}
	loop(0, loopNum);
//  }















/* ======== ここからmain ======== */
//loop(0, hoge); //ループ処理(0から開始してhogeまで)


/* ここにloop関数でループさせる内容を書いてください． */
function loopContent(i){
    //clear();
    rContext.clearRect(0, 0, rContext.width, rContext.height);
	//alert(userHistory.length+","+userHistory[0].g);
	//	alert(userHistory[0].id+",g"+userHistory[0].g+","+userHistory[0].b);
    drawAxis(); //軸を表示

	// 右画面データ点描画
	plotDataPoint(t);
	// 右画面クラスタ中心描画
	plotClusterCenter(t);

    plotClusterCenterHistory(userHistory, i, 0); //userのクラスタ中心の履歴の描画
	// クラスタリング結果のクラスタ中心描画
	// クラスタリング対象のデータを描画
	t++;
	i=t;

	// 左画面描画

}

/* ======== mainここまで ======== */


/*
点を打つ関数
x,yには0から255の間の値を入れてください．
markerは0から4までの数字を選んでください(0:✕, 1:○, 2:●, 3:□, 4:■)
colorは0から5までの数字を選んでください(0:シアン, 1:マゼンタ, 2:イエロー, 3:グリーン, 4:ブルー, 5:レッド)
*/
function plotDot(x, y, marker, color){
    var size = 10;

    /*数値であるか判定*/
    if(x == null || y == null || isNaN(x) || isNaN(y)) return;

    /*キャンバスの端を10%余白として0から255の値をキャンバスに書くための変換*/
    x = x*((rCanvas.width*0.8)/255) + (rCanvas.width*0.1);
    y = y*((rCanvas.height*0.8)/255) + (rCanvas.height*0.1);
    y = rCanvas.height - y; //上下反転変換

    /*色を指定*/
    if(color == 0) color = 'rgb(0, 255, 255)';
    else if(color == 1) color = 'rgb(255, 0, 255)';
    else if(color == 2) color = 'rgb(255, 255, 0)';
    else if(color == 3) color = 'rgb(0, 255, 0)';
    else if(color == 4) color = 'rgb(0, 0, 255)';
    else if(color == 5) color = 'rgb(255, 0, 0)';
    else{
        console.log('error : color is not ploper in this program plotDot')
    }

    /*マーカーを指定して描画*/
    if(marker == 0) drawCrossDot();
    else if(marker == 1) drawStrokeCircleDot();
    else if(marker == 2) drawFillCircleDot();
    else if(marker == 3) drawStrokeSquareDot();
    else if(marker == 4) drawFillSquareDot();
    else{
        console.log("error : marker is not proper in this program plotDot");
        return;
    }

    function drawCrossDot(){
        rContext.beginPath();
        rContext.strokeStyle = color;
        rContext.moveTo(x-size/2, y-size/2);
        rContext.lineTo(x+size/2, y+size/2);
        rContext.stroke();
        rContext.moveTo(x-size/2, y+size/2);
        rContext.lineTo(x+size/2, y-size/2);
        rContext.stroke();
    }
    function drawStrokeCircleDot(){
        rContext.beginPath();
        rContext.strokeStyle = color;
        rContext.arc(x, y, size/2, 0, Math.PI*2, false);
        rContext.stroke();
    }
    function drawFillCircleDot(){
        rContext.beginPath();
        rContext.fillStyle = color;
        rContext.arc(x, y, size/2, 0, Math.PI*2, false);
        rContext.fill();
    }
    function drawStrokeSquareDot(){
        rContext.beginPath();
        rContext.strokeStyle = color;
        rContext.strokeRect(x-size/2, y-size/2, size, size);
    }
    function drawFillSquareDot(){
        rContext.beginPath();
        rContext.fillStyle = color;
        rContext.fillRect(x-size/2, y-size/2, size, size);
    }
}



/*
軸を表示する関数
軸には目盛りは振っていませんが，0から255とだけ描画されるようにしてあります．
*/
function drawAxis(){
    rContext.beginPath();
    rContext.strokeStyle = 'rgb(0, 0, 0)';
    rContext.moveTo(rCanvas.width*0.1, rCanvas.height*0.9);
    rContext.lineTo(rCanvas.width*0.1, rCanvas.height*0.1);
    rContext.stroke();
    rContext.moveTo(rCanvas.width*0.1, rCanvas.height*0.9);
    rContext.lineTo(rCanvas.width*0.9, rCanvas.height*0.9);
    rContext.stroke();
	rContext.fillStyle = 'rgb(0, 0, 0)';
    rContext.fillText('0', rCanvas.width*0.1-10, rCanvas.height*0.9);
    rContext.fillText('255', rCanvas.width*0.1-20, rCanvas.height*0.11);
    rContext.fillText('0', rCanvas.width*0.1, rCanvas.height*0.9+10);
    rContext.fillText('255', rCanvas.width*0.9-10, rCanvas.height*0.9+10);
}



/*
numに指定した回数分のクラスタ中心の履歴をplotする関数
numに0を指定したときは更新回数0(つまり初期状態)をプロットします．
numに1を指定したときは0回目と1回目のクラスタ中心をプロットします．
numに2を指定したときは0回目と1回目と2回目のクラスタ中心をプロットします．
numに3を指定したときは0回目と1回目と2回目と3回目のクラスタ中心をプロットします．
    ... 以下同様
*/
function plotClusterCenterHistory(dotHistory, num, marker){
    var i, n;
    if(num > (dotHistory.length - 4)/4) num = (dotHistory.length - 4)/4; //表示回数がデータの表示できる回数分より大きかった場合はそこで打ち切る

    /*データの表示*/
    for(j = num*4; j < num*4 + 4; j++){
        plotDot(userHistory[j]['g'], userHistory[j]['b'], marker, userHistory[j]['id']);
    }
}



/*
ループ関数, 1000ms毎にloopContentの処理を行う．
iは繰り返しのカウンターの初期値
endCountはカウンターの最後の値
=====以下のコードと同様の動きをします=====
    for(n=i, n <= endCount; n++){
        loopContent();   //上にあるこの関数内にループさせたい処理を書いてください．
        sleep(1000);
    }
*/
function loop(i, endCount){
    if(i <= endCount){
        //console.log('counter:' + i)
        loopContent(i);
        setTimeout(function(){loop(++i, endCount)}, 1000);
    }
}}
