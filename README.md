# 插件功能

导出思源复习记录到 `/data/public/siyuan-plugin-export-revlog` 目录下

后续可以使用 [open-spaced-repetition/fsrs-optimizer](https://github.com/open-spaced-repetition/fsrs-optimizer) 优化器优化 FSRS 算法

# 使用查看日志优化 FSRS

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

![预期功能-参数输入](./public//image-1.png)

![预期功能-训练成功](./public//image-2.png)