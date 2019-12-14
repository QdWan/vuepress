## Nsq

### Mac安装并启动Nsq

#### 安装nsq

```bash
brew install nsq
```

#### 启动nsqlookupd

```bash
nsqlookupd
```

#### 启动nsqadmin

```bash
nsqadmin --lookupd-http-address=127.0.0.1:4161
```

#### 启动nsqd-node

```bash
nsqd --lookupd-tcp-address=127.0.0.1:4160
```



### Demo编写

#### 生产者

```go
package main

import (
	"bufio"
	"fmt"
	"os"
	"strings"

	"github.com/nsqio/go-nsq"
)

var producer *nsq.Producer

func main() {
	nsqAddress := "127.0.0.1:4150"
	err := initProducer(nsqAddress)
	if err != nil {
		fmt.Printf("init producer failed, err:%v\n", err)
		return
	}

	reader := bufio.NewReader(os.Stdin)
	for {
		data, err := reader.ReadString('\n')
		if err != nil {
			fmt.Printf("read string failed, err:%v\n", err)
			continue
		}

		data = strings.TrimSpace(data)
		if data == "stop" {
			break
		}

		err = producer.Publish("order_queue", []byte(data))
		if err != nil {
			fmt.Printf("publish message failed, err %v\n", err)
			continue
		}
		fmt.Printf("publish data:%s succ\n", data)
	}
}

func initProducer(str string) error {
	var err error
	config := nsq.NewConfig()
	producer, err = nsq.NewProducer(str, config)

	if err != nil {
		return err
	}
	return nil
}
```

#### 消费者

```go
package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nsqio/go-nsq"
)

type Consumer struct{}

func (*Consumer) HandleMessage(msg *nsq.Message) error {
	fmt.Println("receive", msg.NSQDAddress, "message:", string(msg.Body))
	return nil
}

func main() {
	err := initConsumer("order_queue", "first", "127.0.0.1:4161")
	if err != nil {
		fmt.Printf("init consumer failed, err:%v\n", err)
		return
	}
	c := make(chan os.Signal)
	signal.Notify(c, syscall.SIGINT)
	<-c
}

func initConsumer(topic string, channel string, address string) error {
	cfg := nsq.NewConfig()
	cfg.LookupdPollInterval = 15 * time.Second
	c, err := nsq.NewConsumer(topic, channel, cfg)
	if err != nil {
		return err
	}

	consumer := &Consumer{}
	c.AddHandler(consumer)

	if err := c.ConnectToNSQLookupd(address); err != nil {
		return err
	}
	return nil
}
```

