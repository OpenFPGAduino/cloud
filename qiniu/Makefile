all:
	#npm install qiniu;
build:
	node qiniu.js -download;
	cd ../../fpga/; ./package_build.sh;
	node qiniu.js -upload;
clean:
	rm -rf node_modules;
