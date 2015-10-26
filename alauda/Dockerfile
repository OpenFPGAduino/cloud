FROM lizhizhou/openfpgaduino
MAINTAINER Zhizhou Li <lzz@meteroi.com>
#RUN ln -s /usr/bin/nodejs /usr/bin/node
ENV PATH /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/gcc/bin:/altera/12.1sp1/quartus/bin:/altera/12.1sp1/quartus/sopc_builder/bin
RUN rm -rf /var/lib/apt/lists/*
RUN git clone https://github.com/OpenFPGAduino/fpga.git
RUN git clone https://github.com/OpenFPGAduino/cloud.git
RUN cd cloud/qiniu; make build;
# RUN echo "nameserver 8.8.8.8" >> /etc/resolv.conf
# RUN cat /etc/resolv.conf
# RUN ping 7xi3cc.com1.z0.glb.clouddn.com -c 3
# RUN ping ftp.cn.debian.org -c 3
