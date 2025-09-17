// ===== API helpers (CloudFront経由, 相対パス) =====
</div>
</div>
</div>
<div class="detail-kv">
<div class="kv-k">概要</div><div class="kv-v">${escape(data.title||'—')}（${escape(data.genre||'—')}）</div>
<div class="kv-k">場所</div><div class="kv-v">${escape(data.area||'—')}</div>
<div class="kv-k">開講状況</div><div class="kv-v">受付中</div>
</div>
<div class="detail-actions">
<button class="btn primary" id="ctaBook">予約する</button>
<button class="btn ghost" id="ctaShare">共有リンクをコピー</button>
</div>
`;
$detail.html(html);
$('#ctaShare').on('click', async ()=>{
const link = location.origin + '/?lessonId=' + encodeURIComponent(data.lessonId);
try { await navigator.clipboard.writeText(link); setStatus('リンクをコピーしました。','ok'); }
catch(e){ setStatus('リンクのコピーに失敗しました。','err'); }
});
$('#ctaBook').on('click', async ()=>{
try{
const userId = ($('#uid').val()||'').trim() || 'demo-user';
const time = new Date(Date.now()+60*60*1000).toISOString();
await apiPost('/bookings', { lessonId: data.lessonId, userId, time });
setStatus('仮予約を作成しました。','ok');
}catch(e){ setStatus('予約に失敗しました。','err'); console.error(e); }
});
setStatus('詳細を表示しました。','ok');
}catch(e){
$('#detail').text('取得に失敗しました。');
setStatus('詳細の取得に失敗しました。','err'); console.error(e);
}
}

async function loadReviews(lessonId){
setStatus(`口コミ取得中… (lessonId=${lessonId})`);
try{
const data = await apiGet('/reviews', { lessonId });
const arr = Array.isArray(data) ? data : (data.reviews || []);
const $wrap = $('#reviews').empty();
if(arr.length===0){ $wrap.append($('<div>').addClass('muted').text('まだ口コミがありません。')); }
arr.forEach(r=>{
const $r = $('<div>').addClass('rev');
$r.append($('<div>').addClass('stars').text(starify(r.rating)));
$r.append($('<div>').text(r.comment || ''));
$r.append($('<div>').addClass('muted').text(`by ${r.userId || 'anonymous'} ／ lessonId ${r.lessonId}`));
$wrap.append($r);
});
setStatus('口コミを表示しました。','ok');
}catch(e){ setStatus('口コミ取得に失敗しました。','err'); console.error(e); }
}

async function postReview(){
const lessonId = $('#lessonSelect').val();
const userId = ($('#uid').val()||'').trim() || 'demo-user';
const rating = Number($('#rating').val()||5);
const comment = ($('#comment').val()||'').trim() || 'とても良かった！';
setStatus('レビューを送信中…');
try{
await apiPost('/reviews', { lessonId, userId, rating, comment });
setStatus('レビューを投稿しました。','ok');
await loadReviews(lessonId);
}catch(e){ setStatus('レビュー投稿に失敗しました。','err'); console.error(e); }
}

// ===== Bindings =====
$(function(){
loadLessons().then(()=>{
const q = getQueryParam('lessonId');
const first = q || $('#lessonSelect').val();
if(first) selectLesson(first);
});
$('#btnRefreshLessons').on('click', ()=> loadLessons());
$('#btnFetchDetail').on('click', ()=> { const id=$('#lessonSelect').val(); if(id) loadDetail(id); });
$('#btnFetchReviews').on('click', ()=> { const id=$('#lessonSelect').val(); if(id) loadReviews(id); });
$('#btnPostReview').on('click', postReview);
});