<CsoundSynthesizer>

<CsOptions>
;============================================================
;Realtime Convolution for multiplatform export
;Giuseppe Ernandez Constp 2024
;============================================================
-odac -iadc
</CsOptions>

<CsInstruments>
;============================================================
;PARAMETRI DI CONTROLLO
;============================================================
sr = 48000
ksmps = 256
nchnls = 2
0dbfs  = 1

;============================================================
;Partitioned Convolution
;============================================================
instr Main

      ; dry wet
      kmix = 0.5
      kgain = 0.5
      ;volume generico
      kvol  = 0.5 * kmix

      ; Dimensione delle partizioni per la convoluzione
      ipartitionsize = 512

      ; Calcolo latenza, copiato dal sorgente
      idel = (ksmps < ipartitionsize ? ipartitionsize + ksmps : ipartitionsize)/sr

      ; Input
      al, ar ins

      ; IR44 file impulso stereo
      awetl, awetr pconvolve kvol*(al+ar), "large.wav", ipartitionsize
      
      ; Delay del segnale per compensare con tempi di calcolo
      ; convoluzione e mettere "a tempo" il riv.
      adryl delay (1-kmix)*al, idel
      adryr delay (1-kmix)*al, idel

      outs (adryl+awetl)*kgain, (adryr+awetr)*kgain
endin

; Prima chiamata, punto di inizio del programma
schedule("Main", 0, -1 )    
</CsInstruments>

<CsScore>

</CsScore>

</CsoundSynthesizer>