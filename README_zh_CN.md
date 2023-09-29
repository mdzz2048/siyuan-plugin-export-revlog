# 插件功能

导出思源复习记录到 `/data/public/siyuan-plugin-export-revlog` 目录下

后续可以使用 [open-spaced-repetition/fsrs-optimizer](https://github.com/open-spaced-repetition/fsrs-optimizer) 优化器优化 FSRS 算法

# 使用查看日志优化 FSRS

## 方案一：（推荐）

打开[fsrs4anki_app](https://huggingface.co/spaces/open-spaced-repetition/fsrs4anki_app)。上传 CSV 文件，选择 Timezone，点击优化即可获得优化参数。

![FSRS4Anki-使用界面](./public/image-3.png)

**报错解决方案**

如果出现提示训练数据不足的报错，请参考[这里](https://github.com/open-spaced-repetition/fsrs-optimizer/issues/13)检查 revlog.csv 文件是否符合要求。

![FSRS4Anki-训练数据不足](./public/image-4.png)

## 方案二：

**安装**

安装 [Python](https://www.python.org/downloads/)，并使用以下命令安装软件包：

```sh
python -m pip install fsrs-optimizer
```

应定期升级以确保拥有最新版本的 FSRS 优化器：

```sh
python -m pip install fsrs-optimizer --upgrade
```

**优化**

在复习记录导出目录下运行：

```sh
python -m fsrs_optimizer "revlog.csv"
```

加 `-y` [跳过交互输入参数](https://github.com/open-spaced-repetition/fsrs-optimizer/issues/13#issuecomment-1670571816)

```sh
python -m fsrs_optimizer "revlog.csv" -y
```


**预期功能**

![预期功能-参数输入](./public/image-1.png)

![预期功能-训练成功](./public/image-2.png)