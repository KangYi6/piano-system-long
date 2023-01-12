<!-- 琴键组件 -->
<template>
	<div class="keyboard" v-show="keyboard">
		<!-- 88键盘 36个黑键 52个白键 -->
		<div id="key21" class="key" @click="keyOn(21)">
			<div v-if="curMidi.some(res=>res.pitch==21)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==21)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key23" class="key" @click="keyOn(23)">
			<div v-if="curMidi.some(res=>res.pitch==23)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==23)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key24" class="key" @click="keyOn(24)">
			<div v-if="curMidi.some(res=>res.pitch==24)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==24)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key26" class="key" @click="keyOn(26)">
			<div v-if="curMidi.some(res=>res.pitch==26)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==26)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key28" class="key" @click="keyOn(28)">
			<div v-if="curMidi.some(res=>res.pitch==28)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==28)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key29" class="key" @click="keyOn(29)">
			<div v-if="curMidi.some(res=>res.pitch==29)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==29)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key31" class="key" @click="keyOn(31)">
			<div v-if="curMidi.some(res=>res.pitch==31)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==31)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key33" class="key" @click="keyOn(33)">
			<div v-if="curMidi.some(res=>res.pitch==33)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==33)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key35" class="key" @click="keyOn(35)">
			<div v-if="curMidi.some(res=>res.pitch==35)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==35)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key36" class="key" @click="keyOn(36)">
			<div v-if="curMidi.some(res=>res.pitch==36)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==36)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key38" class="key" @click="keyOn(38)">
			<div v-if="curMidi.some(res=>res.pitch==38)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==38)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key40" class="key" @click="keyOn(40)">
			<div v-if="curMidi.some(res=>res.pitch==40)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==40)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key41" class="key" @click="keyOn(41)">
			<div v-if="curMidi.some(res=>res.pitch==41)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==41)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key43" class="key" @click="keyOn(43)">
			<div v-if="curMidi.some(res=>res.pitch==43)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==43)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key45" class="key" @click="keyOn(45)">
			<div v-if="curMidi.some(res=>res.pitch==45)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==45)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key47" class="key" @click="keyOn(47)">
			<div v-if="curMidi.some(res=>res.pitch==47)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==47)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key48" class="key" @click="keyOn(48)">
			<div v-if="curMidi.some(res=>res.pitch==48)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==48)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key50" class="key" @click="keyOn(50)">
			<div v-if="curMidi.some(res=>res.pitch==50)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==50)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key52" class="key" @click="keyOn(52)">
			<div v-if="curMidi.some(res=>res.pitch==52)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==52)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key53" class="key" @click="keyOn(53)">
			<div v-if="curMidi.some(res=>res.pitch==53)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==53)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key55" class="key" @click="keyOn(55)">
			<div v-if="curMidi.some(res=>res.pitch==55)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==55)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key57" class="key" @click="keyOn(57)">
			<div v-if="curMidi.some(res=>res.pitch==57)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==57)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key59" class="key" @click="keyOn(59)">
			<div v-if="curMidi.some(res=>res.pitch==59)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==59)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key60" class="key" @click="keyOn(60)">
			<div v-if="curMidi.some(res=>res.pitch==60)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==60)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key62" class="key" @click="keyOn(62)">
			<div v-if="curMidi.some(res=>res.pitch==62)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==62)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key64" class="key" @click="keyOn(64)">
			<div v-if="curMidi.some(res=>res.pitch==64)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==64)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key65" class="key" @click="keyOn(65)">
			<div v-if="curMidi.some(res=>res.pitch==65)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==65)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key67" class="key" @click="keyOn(67)">
			<div v-if="curMidi.some(res=>res.pitch==67)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==67)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key69" class="key" @click="keyOn(69)">
			<div v-if="curMidi.some(res=>res.pitch==69)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==69)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key71" class="key" @click="keyOn(71)">
			<div v-if="curMidi.some(res=>res.pitch==71)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==71)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key72" class="key" @click="keyOn(72)">
			<div v-if="curMidi.some(res=>res.pitch==72)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==72)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key74" class="key" @click="keyOn(74)">
			<div v-if="curMidi.some(res=>res.pitch==74)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==74)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key76" class="key" @click="keyOn(76)">
			<div v-if="curMidi.some(res=>res.pitch==76)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==76)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key77" class="key" @click="keyOn(77)">
			<div v-if="curMidi.some(res=>res.pitch==77)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==77)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key79" class="key" @click="keyOn(79)">
			<div v-if="curMidi.some(res=>res.pitch==79)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==79)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key81" class="key" @click="keyOn(81)">
			<div v-if="curMidi.some(res=>res.pitch==81)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==81)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key83" class="key" @click="keyOn(83)">
			<div v-if="curMidi.some(res=>res.pitch==83)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==83)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key84" class="key" @click="keyOn(84)">
			<div v-if="curMidi.some(res=>res.pitch==84)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==84)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key86" class="key" @click="keyOn(86)">
			<div v-if="curMidi.some(res=>res.pitch==86)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==86)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key88" class="key" @click="keyOn(88)">
			<div v-if="curMidi.some(res=>res.pitch==88)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==88)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key89" class="key" @click="keyOn(89)">
			<div v-if="curMidi.some(res=>res.pitch==89)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==89)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key91" class="key" @click="keyOn(91)">
			<div v-if="curMidi.some(res=>res.pitch==91)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==91)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key93" class="key" @click="keyOn(93)">
			<div v-if="curMidi.some(res=>res.pitch==93)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==93)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key95" class="key" @click="keyOn(95)">
			<div v-if="curMidi.some(res=>res.pitch==95)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==95)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key96" class="key" @click="keyOn(96)">
			<div v-if="curMidi.some(res=>res.pitch==96)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==96)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key98" class="key" @click="keyOn(98)">
			<div v-if="curMidi.some(res=>res.pitch==98)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==98)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key100" class="key" @click="keyOn(100)">
			<div v-if="curMidi.some(res=>res.pitch==100)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==100)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key101" class="key" @click="keyOn(101)">
			<div v-if="curMidi.some(res=>res.pitch==101)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==101)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key103" class="key" @click="keyOn(103)">
			<div v-if="curMidi.some(res=>res.pitch==103)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==103)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key105" class="key" @click="keyOn(105)">
			<div v-if="curMidi.some(res=>res.pitch==105)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==105)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key107" class="key" @click="keyOn(107)">
			<div v-if="curMidi.some(res=>res.pitch==107)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==107)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key108" class="key" @click="keyOn(108)">
			<div v-if="curMidi.some(res=>res.pitch==108)" class="whiteKey cur"></div>
			<div v-else-if="errMidi.some(res=>res==108)" class="whiteKey err"></div>
			<div v-else class="key whiteKey"></div>
		</div>
		<div id="key22" class="key" @click="keyOn(22)">
			<div v-if="curMidi.some(res=>res.pitch==22)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==22)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key25" class="key" @click="keyOn(25)">
			<div v-if="curMidi.some(res=>res.pitch==25)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==25)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key27" class="key" @click="keyOn(27)">
			<div v-if="curMidi.some(res=>res.pitch==27)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==27)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key30" class="key" @click="keyOn(30)">
			<div v-if="curMidi.some(res=>res.pitch==30)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==30)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key32" class="key" @click="keyOn(32)">
			<div v-if="curMidi.some(res=>res.pitch==32)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==32)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key34" class="key" @click="keyOn(34)">
			<div v-if="curMidi.some(res=>res.pitch==34)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==34)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key37" class="key" @click="keyOn(37)">
			<div v-if="curMidi.some(res=>res.pitch==37)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==37)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key39" class="key" @click="keyOn(39)">
			<div v-if="curMidi.some(res=>res.pitch==39)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==39)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key42" class="key" @click="keyOn(42)">
			<div v-if="curMidi.some(res=>res.pitch==42)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==42)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key44" class="key" @click="keyOn(44)">
			<div v-if="curMidi.some(res=>res.pitch==44)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==44)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key46" class="key" @click="keyOn(46)">
			<div v-if="curMidi.some(res=>res.pitch==46)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==46)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key49" class="key" @click="keyOn(49)">
			<div v-if="curMidi.some(res=>res.pitch==49)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==49)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key51" class="key" @click="keyOn(51)">
			<div v-if="curMidi.some(res=>res.pitch==51)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==51)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key54" class="key" @click="keyOn(54)">
			<div v-if="curMidi.some(res=>res.pitch==54)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==54)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key56" class="key" @click="keyOn(56)">
			<div v-if="curMidi.some(res=>res.pitch==56)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==56)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key58" class="key" @click="keyOn(58)">
			<div v-if="curMidi.some(res=>res.pitch==58)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==58)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key61" class="key" @click="keyOn(61)">
			<div v-if="curMidi.some(res=>res.pitch==61)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==61)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key63" class="key" @click="keyOn(63)">
			<div v-if="curMidi.some(res=>res.pitch==63)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==63)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key66" class="key" @click="keyOn(66)">
			<div v-if="curMidi.some(res=>res.pitch==66)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==66)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key68" class="key" @click="keyOn(68)">
			<div v-if="curMidi.some(res=>res.pitch==68)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==68)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key70" class="key" @click="keyOn(70)">
			<div v-if="curMidi.some(res=>res.pitch==70)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==70)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key73" class="key" @click="keyOn(73)">
			<div v-if="curMidi.some(res=>res.pitch==73)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==73)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key75" class="key" @click="keyOn(75)">
			<div v-if="curMidi.some(res=>res.pitch==75)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==75)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key78" class="key" @click="keyOn(78)">
			<div v-if="curMidi.some(res=>res.pitch==78)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==78)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key80" class="key" @click="keyOn(80)">
			<div v-if="curMidi.some(res=>res.pitch==80)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==80)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key82" class="key" @click="keyOn(82)">
			<div v-if="curMidi.some(res=>res.pitch==82)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==82)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key85" class="key" @click="keyOn(85)">
			<div v-if="curMidi.some(res=>res.pitch==85)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==85)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key87" class="key" @click="keyOn(87)">
			<div v-if="curMidi.some(res=>res.pitch==87)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==87)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key90" class="key" @click="keyOn(90)">
			<div v-if="curMidi.some(res=>res.pitch==90)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==90)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key92" class="key" @click="keyOn(92)">
			<div v-if="curMidi.some(res=>res.pitch==92)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==92)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key94" class="key" @click="keyOn(94)">
			<div v-if="curMidi.some(res=>res.pitch==94)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==94)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key97" class="key" @click="keyOn(97)">
			<div v-if="curMidi.some(res=>res.pitch==97)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==97)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key99" class="key" @click="keyOn(99)">
			<div v-if="curMidi.some(res=>res.pitch==99)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==99)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key102" class="key" @click="keyOn(102)">
			<div v-if="curMidi.some(res=>res.pitch==102)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==102)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key104" class="key" @click="keyOn(104)">
			<div v-if="curMidi.some(res=>res.pitch==104)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==104)" class="blackKey err"></div>
			<div v-else class="key blackKey"></div>
		</div>
		<div id="key106" class="key" @click="keyOn(106)">
			<div v-if="curMidi.some(res=>res.pitch==106)" class="blackKey current"></div>
			<div v-else-if="errMidi.some(res=>res==106)" class="blackKey err"></div>
			<div v-else class="blackKey"></div>
		</div>
	</div>
</template>
<script>
	export default {
		name:'keyboard',
		props: {
			keyboard:{
				type: Boolean,
				value:true
			},
			curMidi: {
				type: Array,
				value: []
			},
			errMidi: {
				type: Array,
				value: []
			}
		},
		data() {
			return {
				
			}
		},
		mounted() {
		},
		methods: {
			keyOn(note){
				uni.$emit('keyOn',{note:note});
			},
			keyOff(note){
				uni.$emit('keyOff',{note:note});
			}
		}
	}
</script>

<style>
/**
 * 键盘样式
 */
@media screen and (max-width:2565px){
	/* 键盘 */
	.keyboard{
		width:2860px;
		height:30px;
		position: absolute;
		left:-193px;
		bottom:0;
		background: rgb(207,207,207);
		box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
	}
	.key{
		width:56.4px;
		height:100%;
		float:left;
	}
	.key:first-child{
		border-left:0;
	}
	.key:last-child{
		border-right:1rpx #fff solid;
	}
	.whiteKey {
		background-color:#fff;
		width: calc(100% - 3px);
		height:100%;
		/* border-left:3px rgba(0,0,0,0) solid; */
		border-top-left-radius:5px;
		border-top-right-radius:5px;
	}
	.blackKey {
		width:30px;
		height:20px;
		background-color:#000;
		position: absolute;
		bottom:0;
		border-top-left-radius:5px;
		border-top-right-radius:5px;
	}
	/* 88键 每个键平均49.22  黑键半个键是22  所以全键盘每半个黑键的偏移量是27.22 */
	/* 由于长条屏尺寸，实际显示左右会各少 5个键 左右各少2个黑键，3个白键 经计算后，每个键为53.4 黑键半个键是15 所以实际全键盘每半个黑键的偏移量是33.64 */
	#key22 .blackKey{left:33.64px;}
	#key25 .blackKey{left:calc(2*53.4px + 33.64px);}
	#key27 .blackKey{left:calc(3*53.4px + 50px);}
	#key30 .blackKey{left:calc(5*53.4px + 46px);}
	#key32 .blackKey{left:calc(6*53.4px + 55px);}
	#key34 .blackKey{left:calc(7*53.4px + 64px);}
	#key37 .blackKey{left:calc(9*53.4px + 60px);}
	#key39 .blackKey{left:calc(10*53.4px + 71px);}
	#key42 .blackKey{left:calc(12*53.4px + 64px);}
	#key44 .blackKey{left:calc(13*53.4px + 76px);}
	#key46 .blackKey{left:calc(14*53.4px + 86px);}
	#key49 .blackKey{left:calc(16*53.4px + 90px);}
	#key51 .blackKey{left:calc(17*53.4px + 90px);}
	#key54 .blackKey{left:calc(19*53.4px + 88px);}
	#key56 .blackKey{left:calc(20*53.4px + 96px);}
	#key58 .blackKey{left:calc(21*53.4px + 106px);}
	#key61 .blackKey{left:calc(23*53.4px + 102px);}
	#key63 .blackKey{left:calc(24*53.4px + 112px);}
	#key66 .blackKey{left:calc(26*53.4px + 106px);}
	#key68 .blackKey{left:calc(27*53.4px + 114px);}
	#key70 .blackKey{left:calc(28*53.4px + 127px);}
	#key73 .blackKey{left:calc(30*53.4px + 118px);}
	#key75 .blackKey{left:calc(31*53.4px + 134px);}
	#key78 .blackKey{left:calc(33*53.4px + 130px);}
	#key80 .blackKey{left:calc(34*53.4px + 138px);}
	#key82 .blackKey{left:calc(35*53.4px + 148px);}
	#key85 .blackKey{left:calc(37*53.4px + 141px);}
	#key87 .blackKey{left:calc(38*53.4px + 154px);}
	#key90 .blackKey{left:calc(40*53.4px + 150px);}
	#key92 .blackKey{left:calc(41*53.4px + 160px);}
	#key94 .blackKey{left:calc(42*53.4px + 170px);}
	#key97 .blackKey{left:calc(44*53.4px + 165px);}
	#key99 .blackKey{left:calc(45*53.4px + 175px);}
	#key102 .blackKey{left:calc(47*53.4px + 170px);}
	#key104 .blackKey{left:calc(48*53.4px + 185px);}
	#key106 .blackKey{left:calc(49*53.4px + 140px);}
	.cur{
		background-color: #98ef96;
	}
	.current{
		background-color: #98ef96;
		border-left:3px #98ef96 solid;
	}
	.err{
		background-color: #f00 !important;
	}
}
@media screen and (max-width:1925px){
	/* 键盘 */
	.keyboard{
		width:100%;
		height:40px;
		position: absolute;
		left:0;
		bottom:0;
		background: rgb(207,207,207);
		box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.3);
	}
	.key{
		width:calc(1.923% - 1px);
		border-left:1px rgb(207,207,207) solid;
		border-top-left-radius:0;
		border-top-right-radius:0;
		border-bottom-left-radius:4px;
		border-bottom-right-radius:4px;
	}
	.key:first-child{
		border-left:0;
	}
	.key:last-child{
		border-right:1rpx rgb(207,207,207) solid;
	}
	.whiteKey {
		background-color:#fff;
		width: calc(100% - 1px);
		height:100%;
		border-top-left-radius:0;
		border-top-right-radius:0;
		border-bottom-left-radius:4px;
		border-bottom-right-radius:4px;
	}
	.blackKey {
		width:calc(1.5% - 1px);
		height:25px;
		border-top-left-radius:0;
		border-top-right-radius:0;
		border-bottom-left-radius:4px;
		border-bottom-right-radius:4px;
		top:0;
	}
	#key22 .blackKey{left:calc(1.923% - 1.5%/2);}
	#key25 .blackKey{left:calc(2*1.923% + 1.173%);}
	#key27 .blackKey{left:calc(3*1.923% + 1.173%);}
	#key30 .blackKey{left:calc(5*1.923% + 1.173%);}
	#key32 .blackKey{left:calc(6*1.923% + 1.173%);}
	#key34 .blackKey{left:calc(7*1.923% + 1.173%);}
	#key37 .blackKey{left:calc(9*1.923% + 1.173%);}
	#key39 .blackKey{left:calc(10*1.923% + 1.173%);}
	#key42 .blackKey{left:calc(12*1.923% + 1.173%);}
	#key44 .blackKey{left:calc(13*1.923% + 1.173%);}
	#key46 .blackKey{left:calc(14*1.923% + 1.173%);}
	#key49 .blackKey{left:calc(16*1.923% + 1.173%);}
	#key51 .blackKey{left:calc(17*1.923% + 1.173%);}
	#key54 .blackKey{left:calc(19*1.923% + 1.173%);}
	#key56 .blackKey{left:calc(20*1.923% + 1.173%);}
	#key58 .blackKey{left:calc(21*1.923% + 1.173%);}
	#key61 .blackKey{left:calc(23*1.923% + 1.173%);}
	#key63 .blackKey{left:calc(24*1.923% + 1.173%);}
	#key66 .blackKey{left:calc(26*1.923% + 1.173%);}
	#key68 .blackKey{left:calc(27*1.923% + 1.173%);}
	#key70 .blackKey{left:calc(28*1.923% + 1.173%);}
	#key73 .blackKey{left:calc(30*1.923% + 1.173%);}
	#key75 .blackKey{left:calc(31*1.923% + 1.173%);}
	#key78 .blackKey{left:calc(33*1.923% + 1.173%);}
	#key80 .blackKey{left:calc(34*1.923% + 1.173%);}
	#key82 .blackKey{left:calc(35*1.923% + 1.173%);}
	#key85 .blackKey{left:calc(37*1.923% + 1.173%);}
	#key87 .blackKey{left:calc(38*1.923% + 1.173%);}
	#key90 .blackKey{left:calc(40*1.923% + 1.173%);}
	#key92 .blackKey{left:calc(41*1.923% + 1.173%);}
	#key94 .blackKey{left:calc(42*1.923% + 1.173%);}
	#key97 .blackKey{left:calc(44*1.923% + 1.173%);}
	#key99 .blackKey{left:calc(45*1.923% + 1.173%);}
	#key102 .blackKey{left:calc(47*1.923% + 1.173%);}
	#key104 .blackKey{left:calc(48*1.923% + 1.173%);}
	#key106 .blackKey{left:calc(49*1.923% + 1.173%);}
	.cur{
		background-color: #98ef96;
	}
	.current{
		border-left:1px #98ef96 solid;
	}
	.err{
		background-color: #f00 !important;
	}
}
</style>