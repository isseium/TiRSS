// スタート
Ti.API.debug('処理開始');   // ログ出力

// 対象のサイト
var rssUrls = [
  "http://jp.techcrunch.com/feed/",
  "http://rss.rssad.jp/rss/itmtop/1.0/topstory.xml"
];

// ウィンドウが開いたときの動作
$.list.addEventListener('focus', function(e){
  // いったんテーブルを削除
  $.tableView.setData([]);
  
  // RSSからXML情報を取得したときの処理
  for(var i=0; i<rssUrls.length; i++){
    var client = Ti.Network.createHTTPClient({
      // onload: データ取得時の動作
      onload : function(e) {
        Ti.API.info("Received text: " + this.responseXML);
        
        // RSS の仕様は， http://memorva.jp/memo/website/rss.php 参照
        var channel = this.responseXML.documentElement.getElementsByTagName("channel").item(0);
        var channel_title = channel.getElementsByTagName("title").item(0).text;
        var items = this.responseXML.documentElement.getElementsByTagName("item");
        
        // RSS を 1 件ずつ処理
        for (var j=0;j<items.length;j++) {
          // ログに表示
          Ti.API.debug(items.item(j).getElementsByTagName("title").item(0).text);
          Ti.API.debug(items.item(j).getElementsByTagName("link").item(0).text);
          
          // ラベル作成
          // Advanced: Alloy Viewをもっと活用する方法あり
          var row = Ti.UI.createTableViewRow({
            height: "50dp",
            width:  Ti.UI.FILL,
            backgroundColor: '#ffffff',
            url:   items.item(j).getElementsByTagName("link").item(0).text
          });
          
          var view = Ti.UI.createView({
            text: items.item(j).getElementsByTagName("title").item(0).text,
          });
          
          var label_article_title = Ti.UI.createLabel({
            color: "#000000",
            top: "0dp",
            height: "50%",
            width:  Ti.UI.FILL,
            textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
            text: items.item(j).getElementsByTagName("title").item(0).text,
          });
          
          var label_channel_title = Ti.UI.createLabel({
            color: "#aaaaaa",
            bottom: "0dp",
            height: "50%",
            width:  Ti.UI.FILL,
            textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
            text: channel_title,
            font: {
              size: "10dp",
            }
          });
          
          view.add(label_article_title);
          view.add(label_channel_title);
          row.add(view);
          
          $.tableView.appendRow(row);
        }
        
        /* // Memo: JSONファイルのときの例
        var json = JSON.parse(this.responseText);   // 例えば，
                                                    // [{"name":"taro", "age": 20}}, {"name":"jiro", "age": 18}]
                                                    //  という JSONのときは
        json[0].name                                // => Taro
        json[1].age                                 // => 18 となる
        */
      },
      // onerror: 通信失敗時の動作
      onerror : function(e) {
        Ti.API.debug(e.error);
        alert('error');
      },
    });
  
    client.open("GET", rssUrls[i]);
    client.send();
  }
  
});


$.tableView.addEventListener('click', function(e){
  Ti.API.debug(e);
  Ti.API.debug(e.row.url);
  Ti.Platform.openURL(e.row.url);
});


$.index.open();
