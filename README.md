# problemMap-cordova-
cordova web app with google map javascipt api v3

功能介紹:能夠在地圖上顯示周昭附近出現的災害及問題，並且在問題回報功能上，直接開啟Line message進行回報

使用: 前端為cordova+ionic框架,後端則是使用php+Line robot 

![alt tag](http://i.imgur.com/foUnJGe.png?1)

為初始介面,會顯示附近問題marker

![alt tag](http://i.imgur.com/nQZMMUM.png?1)

點擊all後,會顯示全部問題marker

![alt tag](http://i.imgur.com/CX2S2CA.png?1)

點擊任一marker後,可以看到問題大綱,此圖為水質問題(政府公開資料)

![alt tag](http://i.imgur.com/qo8QMJq.png?1)

點擊window後,可以看到詳細內容 標題 地點 時間 內文

![alt tag](http://i.imgur.com/yfagdfe.png?1)

按下視覺化後,問題會依類別用不同顏色表示,圓圈大小為關注程度

![alt tag](http://i.imgur.com/UrpSzDB.png?1)

點擊搜尋按鈕,可以使用搜尋功能,可以用關鍵字選出要的問題內容

![alt tag](http://i.imgur.com/hogD0x6.jpg?2)

點擊問題回報,會跳轉到Line messager應用程式,機器人會開始詢問案件相關內容

![alt tag](http://i.imgur.com/KjvCqkJ.jpg?1)

填入內容,後端系統將問題會自動分類(使用ibm bluemix語意辨識功能),最後事發圖片和地理位址,就能完成案件回報

