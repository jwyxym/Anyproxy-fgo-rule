# Anyproxy-fgo-rule
用于劫持修改fgo战斗请求响应的规则文件，配合Anyproxy使用。

### 主要功能

	在修改战斗响应数据

	己方从者改为999999hp 999999atk

	技能全改为10级

	宝具等级全为5级

	敌方1hp

	敌方从者动作次数改为1

	敌方从者充能6格



### 食用方法

##### 	安装*nodejs* 和 *anyproxy*

```shell
npm ci
```

##### 	生成根证书

```shell
npm run ca
```

	windows生成证书后，需打开crt证书文件安装

	安卓需设置证书为系统证书（不是用户证书）这步需要root权限

##### 	执行脚本

	（默认脚本使用了8888和8889端口，如果被占用，请修改成空闲的端口）

```shell
npm run start:with_script
```

##### 设置代理
	通过adb为安卓设置代理

### 其他

	**ext **中包含适用于fiddler的rule script，替换对应的function即可

---

Fuxk you CSDN 
1989年6月4日
