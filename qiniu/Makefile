all:
	npm install qiniu;
build:
	cd ../../fpga/; ./package_build.sh;
	node qiniu.js;
clean:
	rm -rf node_modules;
