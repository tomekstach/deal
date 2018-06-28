# autoigrame.js

Jak umieścić iframe ze pulpitem na stronie.

## Kroki do wykonania

1. Umieścić plik autoiframe.js na serwerze
2. Umieścić plik get-from-wapro.php na serwerze
3. Podlinkować go w headzie strony w nastęujący sposób: <script type="text/javascript" id="iframe-script" src="http://link-do-pliku-na-serwerze/autoiframe.js?http://deal.astosoft.kylos.pl"></script> - po pytajniku musi być adres strony, na której znajduje się iframe
4. Umieścić na stronie iframe: <iframe class="autoiframe" src="link-do-pliku-na-serwerze/get-from-wapro.php?src=http://www.wapro.pl/aktualnosci-aplikacja/aktualnosci/" width="100%"></iframe>
