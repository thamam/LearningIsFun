# **READY TO PASTE: Navigation Feature Code**

## 📋 **Simple Instructions**

1. **Open** your working `Emma_math_lab.html` file in any text editor
2. **Find** the `</body>` tag at the very end of the file
3. **Copy** the entire code block below
4. **Paste** it RIGHT BEFORE the `</body>` tag
5. **Save** the file and test in browser

---

## 📍 **Where to Paste**

```html
    <!-- Your existing content ends here -->
    
    <!-- PASTE THE CODE BLOCK HERE ⬇️ -->
    
</body>
</html>
```

---

## 💾 **Code to Copy & Paste**

```html
<script>
(function(){console.log('🚀 Loading Navigation Feature Patch...');if(!document.querySelector('style[data-nav-patch]')){const navCSS=document.createElement('style');navCSS.setAttribute('data-nav-patch','true');navCSS.textContent=`.question-navigation{margin:20px 0;padding:15px;background:#f5f7fa;border-radius:10px}.nav-buttons{display:flex;gap:10px;justify-content:center;margin-bottom:10px}.nav-btn{font-size:14pt;font-weight:600;padding:10px 20px;border:2px solid #2196f3;background:white;border-radius:8px;cursor:pointer;font-family:'Noto Sans Hebrew',Arial,sans-serif;transition:all 0.3s ease}.nav-btn:hover:not(:disabled){background:#e3f2fd}.nav-btn:disabled{opacity:0.5;cursor:not-allowed}.skip-btn{border-color:#ff9800;color:#ff9800}.question-indicator{text-align:center;font-size:12pt;font-weight:600;color:#666}.skipped-counter{color:#ff9800;font-weight:700}`;document.head.appendChild(navCSS)}function extendStates(){[window.decimalState,window.multiplicationState,window.numberlineState].forEach(state=>{if(state&&!state.questionBank){state.questionBank=[];state.currentQuestionIndex=0;state.skippedQuestions=[];state.answeredQuestions=[];state.questionStatus={}}})}function injectNavigationUI(){['decimal','multiplication','numberline'].forEach(tool=>{const answerArea=document.querySelector(`#${tool}-section .answer-area`);if(!answerArea||document.getElementById(`nav-container-${tool}`))return;const navHTML=`<div class="question-navigation" id="nav-container-${tool}"><div class="nav-buttons"><button class="nav-btn" id="prev-btn-${tool}">◄ הקודם</button><button class="nav-btn skip-btn" id="skip-btn-${tool}">⏭️ דלג</button><button class="nav-btn" id="next-btn-${tool}">הבא ►</button></div><div class="question-indicator">שאלה <span id="current-q-${tool}">1</span> | נענו: <span id="answered-count-${tool}">0</span> | דולגו: <span id="skipped-count-${tool}" class="skipped-counter">0</span></div></div>`;answerArea.insertAdjacentHTML('afterend',navHTML);document.getElementById(`prev-btn-${tool}`).onclick=()=>window.goToPrevious(tool);document.getElementById(`skip-btn-${tool}`).onclick=()=>window.skipQuestion(tool);document.getElementById(`next-btn-${tool}`).onclick=()=>window.goToNext(tool)})}window.goToPrevious=function(toolName){const state=getState(toolName);if(state.currentQuestionIndex>0){state.currentQuestionIndex--;displayQuestionFromBank(toolName);window.updateNavigationUI(toolName)}};window.goToNext=function(toolName){const state=getState(toolName);if(state.currentQuestionIndex<state.questionBank.length-1){state.currentQuestionIndex++;displayQuestionFromBank(toolName)}else{if(toolName==='decimal'&&typeof window.generateDecimalQuestion==='function')window.generateDecimalQuestion();else if(toolName==='multiplication'&&typeof window.generateMultiplicationQuestion==='function')window.generateMultiplicationQuestion();else if(toolName==='numberline'&&typeof window.generateNumberlineQuestion==='function')window.generateNumberlineQuestion()}window.updateNavigationUI(toolName)};window.skipQuestion=function(toolName){const state=getState(toolName);let currentQ=state.questionBank[state.currentQuestionIndex];if(!currentQ&&state.currentQuestion){currentQ={id:Date.now()+Math.random(),question:state.currentQuestion.question||'',questionText:state.currentQuestion.question||'',correctAnswer:state.currentAnswer,type:state.currentQuestion.type||'input',choices:state.currentQuestion.choices||[]};state.questionBank.push(currentQ);state.currentQuestionIndex=state.questionBank.length-1}if(!currentQ)return;if(!currentQ.id)currentQ.id=Date.now()+Math.random();if(!state.skippedQuestions.includes(currentQ.id))state.skippedQuestions.push(currentQ.id);state.questionStatus[currentQ.id]='skipped';const feedback=document.getElementById(`${toolName}-feedback`);if(feedback){feedback.className='feedback';feedback.style.background='#fff3e0';feedback.style.color='#e65100';feedback.style.border='3px solid #ff9800';feedback.innerHTML='⏭️ דילגת על השאלה<br>זה בסדר! נחזור אליה אחר כך';feedback.classList.remove('hidden')}if(typeof window.saveProgress==='function')window.saveProgress(toolName);window.updateNavigationUI(toolName);setTimeout(()=>window.goToNext(toolName),1000)};window.updateNavigationUI=function(toolName){const state=getState(toolName);const currentEl=document.getElementById(`current-q-${toolName}`);const answeredEl=document.getElementById(`answered-count-${toolName}`);const skippedEl=document.getElementById(`skipped-count-${toolName}`);if(currentEl)currentEl.textContent=state.currentQuestionIndex+1;if(answeredEl)answeredEl.textContent=state.answeredQuestions.length;if(skippedEl)skippedEl.textContent=state.skippedQuestions.length;const prevBtn=document.getElementById(`prev-btn-${toolName}`);if(prevBtn)prevBtn.disabled=state.currentQuestionIndex===0};function displayQuestionFromBank(toolName){const state=getState(toolName);if(!state.questionBank||state.questionBank.length===0)return;const question=state.questionBank[state.currentQuestionIndex];if(!question)return;state.currentQuestion=question;state.currentAnswer=question.correctAnswer;document.getElementById(`${toolName}-question`).textContent=question.questionText||question.question;const inputElement=document.getElementById(`${toolName}-answer-input`);const choicesContainer=document.getElementById(`${toolName}-choice-buttons`);if(inputElement)inputElement.style.display='none';if(choicesContainer){choicesContainer.style.display='none';choicesContainer.innerHTML=''}if(question.type==='input'||question.type==='visual-input'){if(inputElement){inputElement.style.display='inline-block';inputElement.value='';inputElement.focus()}}else if((question.type==='choice'||question.type==='visual-choice')&&question.choices){if(choicesContainer){choicesContainer.style.display='flex';question.choices.forEach(choice=>{const btn=document.createElement('button');btn.className='choice-btn';btn.textContent=choice;btn.onclick=function(){if(toolName==='decimal'&&typeof window.selectDecimalChoice==='function')window.selectDecimalChoice(choice,this);else if(toolName==='numberline'&&typeof window.selectNumberlineChoice==='function')window.selectNumberlineChoice(choice,this);getState(toolName).selectedChoice=choice};choicesContainer.appendChild(btn)})}}const checkBtn=document.getElementById(`${toolName}-check-btn`);const newBtn=document.getElementById(`${toolName}-new-question-btn`);if(checkBtn)checkBtn.style.display='inline-block';if(newBtn)newBtn.style.display='none';const feedback=document.getElementById(`${toolName}-feedback`);if(feedback)feedback.className='feedback hidden';if(toolName==='numberline'&&(question.type==='visual'||question.type==='visual-input'||question.type==='visual-choice')){if(typeof window.displayNumberLine==='function')window.displayNumberLine(question)}window.updateNavigationUI(toolName)}function wrapGenerateFunctions(){['decimal','multiplication','numberline'].forEach(toolName=>{const funcName=`generate${toolName.charAt(0).toUpperCase()+toolName.slice(1)}Question`;if(typeof window[funcName]==='function'){const original=window[funcName];window[funcName]=function(){original.call(this);addCurrentQuestionToBank(toolName)}}})}function addCurrentQuestionToBank(toolName){const state=getState(toolName);if(!state.currentQuestion)return;const questionObj={id:Date.now()+Math.random(),question:state.currentQuestion.question||'',questionText:state.currentQuestion.question||'',correctAnswer:state.currentAnswer,type:state.currentQuestion.type||'input',choices:state.currentQuestion.choices||[],range:state.currentQuestion.range,arrowPosition:state.currentQuestion.arrowPosition,targetNum:state.currentQuestion.targetNum};state.questionBank.push(questionObj);state.currentQuestionIndex=state.questionBank.length-1;window.updateNavigationUI(toolName)}function wrapCheckAnswerFunctions(){['decimal','multiplication','numberline'].forEach(toolName=>{const funcName=`check${toolName.charAt(0).toUpperCase()+toolName.slice(1)}Answer`;if(typeof window[funcName]==='function'){const original=window[funcName];window[funcName]=function(){const result=original.call(this);const state=getState(toolName);const currentQ=state.questionBank[state.currentQuestionIndex];if(currentQ&&currentQ.id&&state.correctAnswers>(state._prevCorrectAnswers||0)){if(!state.answeredQuestions.includes(currentQ.id))state.answeredQuestions.push(currentQ.id);state.questionStatus[currentQ.id]='answered';window.updateNavigationUI(toolName)}state._prevCorrectAnswers=state.correctAnswers;return result}}})}function wrapSaveLoadFunctions(){if(typeof window.saveProgress==='function'){const originalSave=window.saveProgress;window.saveProgress=function(toolName){const state=getState(toolName);const navData={questionBank:state.questionBank||[],currentQuestionIndex:state.currentQuestionIndex||0,skippedQuestions:state.skippedQuestions||[],answeredQuestions:state.answeredQuestions||[],questionStatus:state.questionStatus||{}};Object.assign(state,navData);return originalSave.call(this,toolName)}}if(typeof window.loadProgress==='function'){const originalLoad=window.loadProgress;window.loadProgress=function(toolName){const result=originalLoad.call(this,toolName);const state=getState(toolName);if(state){state.questionBank=state.questionBank||[];state.currentQuestionIndex=state.currentQuestionIndex||0;state.skippedQuestions=state.skippedQuestions||[];state.answeredQuestions=state.answeredQuestions||[];state.questionStatus=state.questionStatus||{};window.updateNavigationUI(toolName)}return result}}}function getState(toolName){const states={decimal:window.decimalState,multiplication:window.multiplicationState,numberline:window.numberlineState};return states[toolName]}function init(){try{extendStates();injectNavigationUI();wrapGenerateFunctions();wrapCheckAnswerFunctions();wrapSaveLoadFunctions();console.log('✅ Navigation Feature Patch Loaded Successfully!');['decimal','multiplication','numberline'].forEach(tool=>{if(getState(tool))window.updateNavigationUI(tool)})}catch(error){console.error('❌ Navigation patch failed:',error)}}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()})();
</script>
```

---

## ✅ **Verification Steps**

### After pasting and saving:

1. **Open your HTML file** in Chrome/Firefox/Edge
2. **Press F12** to open Developer Console
3. **Look for this message**: `✅ Navigation Feature Patch Loaded Successfully!`
4. **Go to any practice module** - you should see navigation buttons:
   - **◄ הקודם** (Previous)  
   - **⏭️ דלג** (Skip)
   - **הבא ►** (Next)
5. **Test skip button** - should show orange feedback message

---

## 🚨 **If It Doesn't Work**

- Check you pasted BEFORE `</body>` (not after)
- Look for any red error messages in Console (F12)
- Make sure your original file was working first
- Try refreshing the page (Ctrl+R)

---

That's it! The navigation features will be added to all three math modules without breaking any existing functionality.