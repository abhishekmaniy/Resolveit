export default function LoadingScreen() {
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center bg-white text-center px-4">
            <h1 className="text-4xl font-bold text-primary mb-4">ResolveIt</h1>
            <p className="text-muted-foreground text-lg">Please wait, we are authenticating your account...</p>
        </div>
    );
}