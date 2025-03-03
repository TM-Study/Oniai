## Serverの起動方法

1. `gradle flywayclean`, `gradle flywaymigrate`コマンドでテーブルを構成する
2. `gradle bootrun --args='--spring.profiles.active=dev' ` コマンドでクライアントサーバーを起動させる 
