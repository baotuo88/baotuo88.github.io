---
abbrlink: ''
categories: []
date: '2025-09-13T16:40:10.551017+08:00'
tags: []
title: title
updated: '2025-09-13T16:40:43.082+08:00'
---
在 Armbian 无界面系统上安装和配置 v2rayA 确实是个不错的选择，它可以通过 Web 界面让你更方便地管理代理连接。下面我会为你提供详细的步骤。

这个表格汇总了安装 v2rayA 的主要方式及其特点，你可以根据自己的需求和设备情况选择：


| 安装方式           | 适合的系统                              | 主要优点                         | 需要注意                              |
| ------------------ | --------------------------------------- | -------------------------------- | ------------------------------------- |
| **APT 软件源安装** | Debian、Ubuntu 及其衍生版（如 Armbian） | 官方支持，管理方便（更新、卸载） | 需先安装 V2Ray/Xray 内核              |
| **Docker 安装**    | 任何支持 Docker 的系统（包括 Armbian）  | 环境隔离，不受系统依赖影响       | 需要先安装 Docker，透明代理配置稍复杂 |
| **二进制包安装**   | 各种 Linux 发行版                       | 灵活，无需依赖包管理器           |                                       |


### 📦 一、安装前的准备工作

在安装 v2rayA 之前，你需要确保系统上已经安装了 **V2Ray** 或 **Xray** 内核，因为 v2rayA 是一个前端管理界面，需要依赖这些内核来工作。

1. **更新系统软件包**：首先，确保你的 Armbian 系统是最新的。

   ```
   sudo apt update && sudo apt upgrade -y
   ```


2.安装 V2Ray/Xray 核心：

* **推荐安装 Xray**：Xray 是 V2Ray 的一个分支，通常包含更多新特性和优化。你可以使用官方脚本安装

```
sudo bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
```

* 或者安装 V2Ray

```
sudo bash -c "$(curl -L https://cdn.jsdelivr.net/gh/mzz2017/v2rayA@master/install/go.sh)"
```


* 安装完成后，可以通过以下命令检查是否安装成功：

  ```
  sudo systemctl status xray  # 如果安装的是 Xray
  # 或者
  sudo systemctl status v2ray  # 如果安装的是 V2Ray
  ```

### 🔧 二、安装 v2rayA

你有几种方式来安装 v2rayA，这里介绍最常用的两种：通过 APT 软件源安装和通过 Docker 安装。方法一：通过 APT 软件源安装（推荐用于 Debian/Ubuntu/Armbian）

这是最常见的安装方式，方便后续管理和更新。

1. **添加 v2rayA 的软件源和 GPG 密钥**：

```
# 添加 GPG 密钥
wget -qO - https://apt.v2raya.mzz.pub/key/public-key.asc | sudo tee /etc/apt/trusted.gpg.d/v2raya.asc
# 添加软件源
echo "deb https://apt.v2raya.mzz.pub/ v2raya main" | sudo tee /etc/apt/sources.list.d/v2raya.list
```

2.更新软件包列表并安装 v2rayA：

```
sudo apt update
sudo apt install v2raya
```


#### 方法二：通过 Docker 安装

如果你的系统已经安装了 Docker，这是一个非常干净且隔离的选择。

1. **确保 Docker 已安装**：如果还没安装 Docker，请先安装。
2. **拉取并运行 v2rayA 镜像**：
   对于 Linux 系统（包括 Armbian），**强烈建议使用 `--network=host` 模式**以获得最佳兼容性和功能支持（如透明代理）

```
sudo docker run -d \
  --name v2raya \
  --restart=always \
  --privileged \
  --network=host \
  -v /etc/v2raya:/etc/v2raya \
  -v /lib/modules:/lib/modules \
  mzz2017/v2raya
```

* `--privileged` 和 `-v /lib/modules:/lib/modules`: 这些参数对于启用**全局透明代理**功能通常是必需的。
* `-v /etc/v2raya:/etc/v2raya`: 将容器内的配置目录映射到主机，保证配置持久化。


### 🚀 三、启动和设置 v2rayA

安装完成后，你需要启动 v2rayA 服务。

1. **启动 v2rayA 服务**（如果你使用 APT 方式安装）：

```
# 启动 v2rayA 服务
sudo systemctl start v2raya.service
# 设置 v2rayA 开机自启
sudo systemctl enable v2raya.service
```

Docker 方式在运行容器时已经使用了 `--restart=always` 参数，所以会自动重启。

2.检查服务状态（APT 方式）：

```
sudo systemctl status v2raya.service
```

如果状态为 `active (running)`，说明启动成功。

🌐 四、访问 Web 界面并配置
现在，你可以在浏览器中访问 v2rayA 的 Web 管理界面了。

1. 打开浏览器：在你的 本地电脑（比如 Windows 或 macOS 机器）上打开浏览器。
2. 访问 v2rayA：在地址栏输入 http://<你的 Armbian 设备的 IP 地址>:2017。
   ◦ 例如：http://192.168.1.10:2017
   ◦ 你需要知道你的 Armbian 设备的局域网 IP 地址，可以通过在 Armbian 上执行 ip addr 或 hostname -I 查看。
3. 首次设置：
   ◦ 首次访问，会看到创建管理员账户的界面，设置用户名和密码。
   ◦ 登录后，你可能会看到提示设置透明代理或代理模式的界面，可以根据需要选择（例如，透明代理需要 TUN 支持或特定的网络配置）。
4. 添加代理节点：
   ◦ 在 Web 界面中，找到 "节点" 或 "Servers" 选项。
   ◦ 你可以通过 "导入" 功能，粘贴 VMess/VLESS/SS/SSR/Trojan 等协议的分享链接，或者手动输入节点信息。
   ◦ 如果你有订阅地址，可以在 "订阅" 区域添加，然后点击 "更新" 来获取节点列表。
5. 连接节点：从节点列表中选择一个你想连接的节点，点击 "连接" 或类似的按钮。

### ⚙️ 五、配置系统代理或透明代理（可选）

仅仅在 v2rayA 里连接节点，并不意味着你系统上的所有流量都会走代理。你需要额外配置：

* **方式一：环境变量**（针对命令行工具）
  你可以在当前终端临时设置：

```
export http_proxy="http://127.0.0.1:20171"
export https_proxy="http://127.0.0.1:20171"
```


`20171` 是 v2rayA 默认开放的 HTTP 代理端口。

要使环境变量永久生效，可以将上述命令添加到 `~/.bashrc` 或 `/etc/environment` 文件中。

*方式二：透明代理**（全局代理，所有流量都经过代理）
这需要在 v2rayA 的 Web 界面设置中启用**透明代理**选项，并可能需要一些额外的系统配置（如设置 iptables）。这对于在路由器上运行 v2rayA 尤其有用。请注意，透明代理的配置相对复杂。

### ❗ 六、注意事项和常见问题

* **防火墙**：确保 Armbian 的防火墙（如 `ufw`）没有阻止相关端口（2017, 20170-20172 等）的访问。
* **核心版本**：偶尔会出现 v2rayA 与最新版 Xray/V2Ray 核心暂时不兼容的情况。如果遇到问题，可以尝试降级核心版本。
* **无法访问 Web 界面**：检查 v2rayA 服务是否正常运行，检查防火墙设置，确认 IP 地址和端口是否正确。
* **日志查询**：
  * 对于 APT 安装：`sudo journalctl -u v2raya.service -f`
  * 对于 Docker 安装：`sudo docker logs v2raya`
* **数据持久化**：Docker 方式通过 `-v /etc/v2raya:/etc/v2raya` 将配置保存在了主机上，即使删除容器，配置也不会丢失。
* **更新 v2rayA**：
  * APT 方式：`sudo apt update && sudo apt upgrade`
  * Docker 方式：需要拉取新镜像并重新创建容器。

希望这份详细的指南能帮助你在 Armbian 上顺利安装和使用 v2rayA！
