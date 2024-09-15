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

; Prima chiamata, punto di inizio del programma
schedule("Main", 0, -1 )    
</CsInstruments>

<CsScore>

</CsScore>

</CsoundSynthesizer>