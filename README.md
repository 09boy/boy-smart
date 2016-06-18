[![Boy-Smart Logo](http://www.09boy.cn/boy-smart/boy-smart-logo.png)](https://github.com/09boy/boy-smart)

Front-end

## Installation

#### Both npm and git are installing

##### 1. npm install

** 可将包安装到全局环境中 [ 建议 ] **
 	
```bash
  $ npm install boy-smart -g  
```

** 本地安装 **

cd 命令进入你工作的目录。这里用我的目录举例 /Users/xx-name/personal/test-smart

```bash
  $ cd /Users/xx-name/personal/test-smart
```

安装 boy-smart

```bash
  $ npm install --save-dev boy-smart
```


##### 2. git install

cd 命令进入你工作的目录。这里用我的目录举例 /Users/xx-name/personal/test-smart

```bash
 $ git clone git@github.com:09boy/boy-smart.git
```


本地安装完毕后需要通过 npm link boy-smart 命令开启 smart 命令，之后可以在任何地方使用 smart 命令。相当于全局安装

```bash
  $ npm link boy-smart
```


***

到这里包已经安装完毕了。使用之前需要了解几个 smart 命令 和开发目录结构:

### smart cli :

###### 'smart -h' | 'smart --help' 查看全部命令帮助

###### smart 命令目前有两个可选参数  [ samrt start -P 9090 ]

添加 --port 或 [简写] -P 参数设置端口, 默认 8080

添加 --host 或 [简写] -H 参数设置domain, 默认 127.0.0.1


##### 1. start  ［开发环境，调试代码，不压缩代码］

启动一个默认端口为8080本地服务器作为开发环境 | 或者启动一个 9090 本地服务器

```bash
 		$ smart start | smart start -P 9090
```


##### 2. test 代码单元测试 [ mocha & chai ]

```bash
 		$ smart test
```


##### 3. release devel | public | production

启动一个本地服务器 & 打包资源（合并，压缩），用于内测／公测／生产环境

```bash
 		$ smart release production
```


##### 4. page <page-name>

创建一个 [ about ] 页面

```bash
 		$ smart page about
```


创建多个页面[ about, contact, category ...],如下:

```bash
 		$ smart page about contact category 
```

##### 5. component <component-name>

```bash
 		$ smart component HeaderComponent
```

创建一个名为 ［ HeaderComponent ］的 React 组件


##### 如果上面5个命令嫌麻烦,只记一个 smart 好啦
```bash
 		$ smart
```

然后会出现下面选项（和上面5个命令相对应）, Use arrow keys （通过键盘方向键选择，按回车确认，按 control + c 退出）

![smart cli - interactive](http://www.09boy.cn/boy-smart/interactive.png)



## Structure [ 目录结构 ]


```
    |-- build                                           ＃ 打包目录
    |
    |-- mochawesome-reports                             ＃ 单元测试报告网页目录
    |
    |-- src                                             ＃ 开发目录
    	|
        |-- assets                                      ＃ 静态资源目录
        |   |
        |   |-- fonts                                   ＃ 字体目录
        |   |
        |   |-- images                                  ＃ 图片目录
        |   |
        |   |-- js                                      ＃ js common 目录
        |   |
        |   |-- sass                                    ＃ sass 目录
        |-- components                                  ＃ 组件目录
        |
        |-- pages                                       ＃ 页面目录
        |
        |-- test                                        ＃ 单元测试目录
```

## 使用注意事项

整理中...

#### Issues: <https://github.com/09boy/boy-smart/issues>
