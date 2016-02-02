all:
	@for module in `ls -l | grep ^d | awk '{ print $$NF }' | sed 's/linux//g'`; do \
	echo "Build submodule "$$module;                                               \
	cd $$module; make; cd .. ;                                                     \
	done
clean:
	@for module in `ls -l | grep ^d | awk '{ print $$NF }'`; do                    \
	echo "Build submodule "$$module;                                               \
	cd $$module; make clean ; cd .. ;                                              \
	done

format: clean
	find . -name "*.js" -exec js-beautify -r {} \;	 
	find . -name "*.html" -exec html-beautify -r {} \;	 
	find . -name "*.css" -exec css-beautify -r {} \;
