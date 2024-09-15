<CsoundSynthesizer>

<CsOptions>
;============================================================
;Realtime Convolution for multiplatform export
;Giuseppe Ernandez Constp 2024
;============================================================
-odac -iadc -d
</CsOptions>

<CsInstruments>
;============================================================
;PARAMETRI DI CONTROLLO
;============================================================
sr = 48000
ksmps = 32
nchnls = 2
nchnls_i = 1 
0dbfs  = 1

;============================================================
;Partitioned Convolution
;============================================================
instr Main

      kmix = .5
      kvol  = .5 * kmix
      iPartSize = 2048
      idel = (ksmps < iPartSize ? iPartSize + ksmps : iPartSize)/sr
      aInput in
      awetl, awetr pconvolve kvol*aInput,"large.wav", iPartSize
      adryl delay (1-kmix)*aInput, idel
      adryr delay (1-kmix)*aInput, idel
            outs adryl+awetl, adryr+awetr
endin

instr Alt

      imix = 0.8
      ivol = 1 
      idel   filelen "small.wav" ; change according to import
      print  idel
      ichnls filenchnls  "small.wav" ; change according to import
      print  ichnls
      aInput in
      awet1, awet2 convolve aInput,"small.cva" ; change according to import
      awet1   diff    awet1                   
      awet2   diff    awet2                   
      adrydel delay   (1-imix)*aInput, idel     
      
      outs    ivol*(adrydel+imix*awet1),ivol*(adrydel+imix*awet2)

endin
; For Main
schedule("Main", 0, -1 )
; For Alt
; schedule("Alt", 0, -1 )

</CsInstruments>

<CsScore>

</CsScore>

</CsoundSynthesizer>